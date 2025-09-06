import mongoose, { Types } from 'mongoose';
import { NotificationService } from '../notification/notification.service';
import { Post } from '../post/post.model';
import { IComment } from './comment.interface';
import { Comment } from './comment.model';
import { User } from '../user/user.model';

// const createCommentIntoDB = async (payload: IComment) => {
//       const session = await mongoose.startSession();
//       session.startTransaction();

//       try {
//             const existingPost = await Post.findById(payload.postId).session(session);
//             if (!existingPost) {
//                   throw new Error('This Post is not found');
//             }

//             const [commenter, postOwner] = await Promise.all([
//                   User.findById(payload.author),
//                   User.findById(existingPost.author),
//             ]);

//             if (!commenter) {
//                   throw new Error('Commenter not found');
//             }
//             if (!postOwner) {
//                   throw new Error('Post Author not found');
//             }

//             const result = await Comment.create([payload], { session });
//             const newComment = result[0];
//             await Post.findByIdAndUpdate(
//                   payload.postId,
//                   { $push: { comments: newComment._id } },
//                   { session, new: true }
//             );

//             //create notification

//             if (postOwner._id.toString() !== commenter._id.toString()) {
//                   const newNotification = await NotificationService.createNotificationToDB({
//                         recipient: new Types.ObjectId(postOwner._id),
//                         commentId: newComment._id.toString(),
//                         postId: payload.postId.toString(),
//                         type: 'comment',
//                         title: 'Comment Post',
//                         message: `${commenter.userName} commented in your post`,
//                         read: false,
//                   });
//                   //@ts-ignore
//                   const io = global.io;
//                   if (io) {
//                         io.emit(`notification::${postOwner._id.toString()}`, newNotification);
//                   }
//             }

//             await session.commitTransaction();
//             return newComment;
//       } catch (error) {
//             await session.abortTransaction();
//             throw error;
//       } finally {
//             session.endSession();
//       }
// };
const createCommentIntoDB = async (payload: IComment) => {
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
            const existingPost = await Post.findById(payload.postId)
                  .populate('comments')
                  .session(session);
            if (!existingPost) {
                  throw new Error('This Post is not found');
            }

            const [commenter, postOwner] = await Promise.all([
                  User.findById(payload.author),
                  User.findById(existingPost.author),
            ]);

            if (!commenter) {
                  throw new Error('Commenter not found');
            }
            if (!postOwner) {
                  throw new Error('Post Author not found');
            }

            const result = await Comment.create([payload], { session });
            const newComment = result[0];
            await Post.findByIdAndUpdate(
                  payload.postId,
                  { $push: { comments: newComment._id } },
                  { session, new: true }
            );

            // Notification logic
            const notifications = [];
            const postSlug = await Post.findById(payload.postId).select("slug")
            // 1. Notify post owner (if not commenting on own post)
            if (postOwner._id.toString() !== commenter._id.toString()) {
                  const postOwnerNotification = await NotificationService.createNotificationToDB({
                        recipient: postOwner._id,
                        commentId: newComment._id.toString(),
                        postSlug: postSlug?.slug,
                        type: 'comment',
                        title: 'New Comment on Your Post',
                        message: `${commenter.userName} commented on your post`,
                        read: false,
                  });
                  notifications.push({
                        userId: postOwner._id.toString(),
                        notification: postOwnerNotification
                  });
            }

            // 2. Notify other commenters on the same post (optional feature)
            if (existingPost.comments && existingPost.comments.length > 0) {
                  // Get unique commenters from previous comments
                  const previousComments = await Comment.find({
                        postId: payload.postId,
                        author: { $nin: [commenter._id, postOwner._id] } // Exclude current commenter and post owner
                  }).populate('author', '_id userName').session(session);

                  const uniqueCommenters = new Set();
                  const previousCommenterNotifications = [];

                  for (const comment of previousComments) {
                        const commenterId = (comment.author as any)._id.toString();
                        if (!uniqueCommenters.has(commenterId)) {
                              uniqueCommenters.add(commenterId);
                              const postSlug = await Post.findById(comment.postId).select("slug")
                              const commenterNotification = await NotificationService.createNotificationToDB({
                                    recipient: comment.author,
                                    commentId: newComment._id.toString(),
                                    postSlug: postSlug?.slug,
                                    type: 'comment_reply',
                                    title: 'New Comment on a Post You Commented On',
                                    message: `${commenter.userName} also commented on ${postOwner.userName}'s post`,
                                    read: false,
                              });

                              previousCommenterNotifications.push({
                                    userId: commenterId,
                                    notification: commenterNotification
                              });
                        }
                  }

                  notifications.push(...previousCommenterNotifications);
            }

            // Emit real-time notifications
            //@ts-ignore
            const io = global.io;
            if (io && notifications.length > 0) {
                  notifications.forEach(({ userId, notification }) => {
                        io.emit(`notification::${userId}`, notification);
                  });
            }

            await session.commitTransaction();
            return newComment;
      } catch (error) {
            await session.abortTransaction();
            throw error;
      } finally {
            session.endSession();
      }
};


const getMyCommentedPost = async (userId: string) => {
      // First get unique postIds from user's comments
      const userComments = await Comment.find({ author: userId }).distinct('postId');

      // Then fetch those posts with full details
      const result = await Post.find({ _id: { $in: userComments } })
            .populate({
                  path: 'author',
                  select: 'userName name email profile',
            })
            .populate({
                  path: 'comments',
                  populate: [
                        {
                              path: 'author',
                              select: 'userName name email profile',
                        },
                        {
                              path: 'replies',
                              populate: [
                                    {
                                          path: 'author',
                                          select: 'userName name email profile',
                                    },
                              ],
                        },
                  ],
            });

      return result;
};

const replayCommentIntoDB = async (commentId: string, payload: Partial<IComment>) => {
      const existingComment = await Comment.findById(commentId);
      if (!existingComment) {
            throw new Error('Comment not found');
      }
      const result = await Comment.create({
            content: payload.content,
            author: payload.author,
            postId: payload.postId,
      });
      const findUser = await User.findById(payload.author);
      if (!findUser) {
            throw new Error('User not found');
      }
      await Comment.findByIdAndUpdate(commentId, {
            $push: { replies: result._id },
      });
      const author = await User.findById(existingComment.author).select("userName")
      const postSlug = await Post.findById(existingComment.postId).select("slug")
      if (existingComment.author) {
            const newNotification = await NotificationService.createNotificationToDB({
                  recipient: new Types.ObjectId(existingComment.author.toString()),
                  commentSlug: author?.userName,
                  postSlug: postSlug?.slug,
                  type: 'reply',
                  title: 'Reply Comment',
                  message: `${findUser.userName} reply your comment`,
                  read: false,
            });
            //@ts-ignore
            const io = global.io;
            if (io) {
                  io.emit(`notification::${result.author.toString()}`, newNotification);
            }
      }
      return result;
};

const updateCommentIntoDB = async (userId: string, commentId: string, payload: Partial<IComment>) => {
      const result = await Comment.findOne({ _id: commentId });
      if (!result) {
            throw new Error('Comment not found');
      }

      if (result.author.toString() !== userId) {
            throw new Error('You are not authorized to update this comment');
      }
      const updatedComment = await Comment.findByIdAndUpdate(commentId, payload, {
            new: true,
      });

      return updatedComment;
};

const likeCommentFromDB = async (userId: string, commentId: string) => {
      const existingComment = await Comment.findOne({ _id: commentId });
      if (!existingComment) {
            throw new Error('Comment not found');
      }
      const isLiked = existingComment.likes.some((like) => like.toString() === userId);
      if (isLiked) {
            existingComment.likes = existingComment.likes.filter((like) => like.toString() !== userId);
      } else {
            existingComment.likes.push(userId as any);
            await existingComment.save();
      }
      await existingComment.save();
      return existingComment;
};

const deleteCommentFromDB = async (userId: string, commentId: string) => {
      const result = await Comment.findOne({ _id: commentId });
      if (!result) {
            throw new Error('Comment not found');
      }
      if (result.author.toString() !== userId) {
            throw new Error('You are not authorized to delete this comment');
      }
      const deletedComment = await Comment.findOneAndDelete({ _id: commentId });
      await Post.findByIdAndUpdate(result.postId, {
            $pull: { comments: commentId },
      });
      return deletedComment;
};

export const CommentService = {
      createCommentIntoDB,
      getMyCommentedPost,
      replayCommentIntoDB,
      updateCommentIntoDB,
      likeCommentFromDB,
      deleteCommentFromDB,
};
