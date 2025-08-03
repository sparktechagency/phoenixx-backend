import QueryBuilder from '../../../builder/QueryBuilder';
import unlinkFile from '../../../shared/unlinkFile';
import { IPost } from './post.interface';

import { Post } from './post.model';
import { NotificationService } from '../notification/notification.service';
import mongoose, { Types } from 'mongoose';
import { User } from '../user/user.model';
import { Report } from '../report/report.model';
import { Follow } from '../follow/follow.model';

const populateReplies = {
      path: 'replies',
      select: 'content author likes replies',
      populate: [
            {
                  path: 'author',
                  select: 'userName name email profile',
            },
            {
                  path: 'replies',
                  select: 'content author likes replies createdAt',
                  populate: [
                        {
                              path: 'author',
                              select: 'userName name email profile',
                        },
                        {
                              path: 'replies',
                              select: 'content author likes replies createdAt',
                              populate: 'author',
                        },
                  ],
            },
      ],
};
const createPostIntoDB = async (payload: IPost, files: any) => {
    const user = await User.findById(payload.author);
    if (!user) {
        throw new Error('You are not logged in');
    }

    if (files?.image?.length > 0) {
        payload.images = files.image?.map((file: any) => `/images/${file.filename}`);
    }

    const result = await Post.create(payload);

    if (result.author) {
        // Author notification
        const authorNotification = await NotificationService.createNotificationToDB({
            recipient: new Types.ObjectId(result.author.toString()),
            postId: result._id.toString(),
            type: 'post',
            title: 'New Post Created',
            message: `Your post has created successfully`,
            read: false,
        });

        // Debug: Check followers
        const followers = await Follow.find({ subscribedTo: result.author }).populate('subscriber', 'name');
        console.log('📊 Total followers found:', followers.length);
        console.log('👥 Followers details:', followers);

        if (followers.length > 0) {
            // Create notifications for followers
            const followerNotifications = [];
            
            for (const follow of followers) {
                console.log('🔄 Processing follower:', follow.subscriber);
                
                const notification = await NotificationService.createNotificationToDB({
                    recipient: new Types.ObjectId(follow.subscriber._id.toString()),
                    postId: result._id.toString(),
                    type: 'new_post_from_following',
                    title: 'New Post from Someone You Follow',
                    message: `${user.name} has created a new post`,
                    read: false,
                });
                
                followerNotifications.push(notification);
                console.log('✅ Notification created for:', follow.subscriber);
            }

            // Socket.io emissions
            const io = global.io;
            if (io) {
                console.log('🔌 Socket.io available, emitting notifications...');
                
                // Notify author
                io.emit(`notification::${result.author.toString()}`, authorNotification);
                console.log('📤 Author notification sent');

                // Notify followers
                followers.forEach((follow, index) => {
                    const eventName = `notification::${(follow.subscriber as any)._id.toString()}`;
                    io.emit(eventName, followerNotifications[index] as any);
                    console.log(`📤 Follower notification sent to: ${eventName}`);
                });
            } else {
                console.log('❌ Socket.io not available');
            }
        } else {
            console.log('⚠️ No followers found for this user');
            
            // Only notify author
            const io = global.io;
            if (io) {
                io.emit(`notification::${result.author.toString()}`, authorNotification);
            }
        }
    }

    return result;
};

// const createPostIntoDB = async (payload: IPost, files: any) => {
//       const user = await User.findById(payload.author);
//       if (!user) {
//             throw new Error('You are not logged in');
//       }

//       if (files?.image?.length > 0) {
//             payload.images = files.image?.map((file: any) => `/images/${file.filename}`);
//       }

//       const result = await Post.create(payload);

//       if (result.author) {
//             // Notification for the post author
//             const authorNotification = await NotificationService.createNotificationToDB({
//                   recipient: new Types.ObjectId(result.author.toString()),
//                   postId: result._id.toString(),
//                   type: 'post',
//                   title: 'New Post Created',
//                   message: `Your post has created successfully`,
//                   read: false,
//             });

//             // Find all followers of the post author
//             const followers = await Follow.find({ subscribedTo: result.author }).populate('subscriber', 'name');

//             // Create notifications for all followers
//             if (followers.length > 0) {
//                   const followerNotifications = await Promise.all(
//                         followers.map(async (follow) => {
//                               return await NotificationService.createNotificationToDB({
//                                     recipient: new Types.ObjectId(follow.subscriber.toString()),
//                                     postId: result._id.toString(),
//                                     type: 'new_post_from_following',
//                                     title: 'New Post from Someone You Follow',
//                                     message: `${user.name} has created a new post`,
//                                     read: false,
//                               });
//                         })
//                   );

//                   // Emit real-time notifications
//                   //@ts-ignore
//                   const io = global.io;
//                   if (io) {
//                         // Notify the author
//                         io.emit(`notification::${result.author.toString()}`, authorNotification);

//                         // Notify all followers
//                         followers.forEach((follow, index) => {
//                               io.emit(
//                                     `notification::${(follow.subscriber as any)._id.toString()}`,
//                                     followerNotifications[index]
//                               );
//                         });
//                   }
//             } else {
//                   // If no followers, just emit notification to author
//                   //@ts-ignore
//                   const io = global.io;
//                   if (io) {
//                         io.emit(`notification::${result.author.toString()}`, authorNotification);
//                   }
//             }
//       }

//       return result;
// };
const updatePostIntoDB = async (id: string, payload: Partial<IPost>, files: any) => {
      const existingPost = await Post.findById(id);

      if (!existingPost) {
            throw new Error('Post not found');
      }

      // Start with existing images
      let images = [...existingPost.images];

      // Handle deleted images
      if (typeof payload.deletedImages === 'string') {
            payload.deletedImages = JSON.parse(payload.deletedImages);
            if (Array.isArray(payload.deletedImages)) {
                  payload.deletedImages.forEach((image: string) => {
                        unlinkFile(image); // Delete from filesystem
                        images = images.filter((img) => img !== image); // Remove from array
                  });
            }
      }

      // Add new images (if any)
      if (files?.image?.length > 0) {
            const newImages = files.image.map((file: any) => `/images/${file.filename}`);
            images.push(...newImages); // Append new images
      }

      // Update payload with the final images array
      payload.images = images;

      const result = await Post.findByIdAndUpdate(id, payload, {
            new: true,
      });

      return result;
};
const likePostIntoDB = async (id: string, userId: string) => {
      const existingPost = await Post.findById(id);
      if (!existingPost) {
            throw new Error('Post not found');
      }

      // Convert userId to string for comparison
      const isLiked = existingPost.likes.some((like) => like.toString() === userId);

      if (isLiked) {
            existingPost.likes = existingPost.likes.filter((like) => like.toString() !== userId);
      } else {
            existingPost.likes.push(userId as any);
      }
      await existingPost.save();
      const findUser = await User.findById(userId);
      if (!findUser) {
            throw new Error('User not found');
      }
      if (existingPost.author) {
            const newNotification = await NotificationService.createNotificationToDB({
                  recipient: new Types.ObjectId(existingPost.author.toString()),
                  postId: existingPost._id.toString(),
                  type: 'like',
                  title: 'Like Post',
                  message: `${findUser.userName} like your post`,
                  read: false,
            });
            //@ts-ignore
            const io = global.io;
            if (io) {
                  io.emit(`notification::${existingPost.author.toString()}`, newNotification);
            }
      }
      return existingPost;
};

const getAllPostsFromDB = async (query: Record<string, any>) => {
      const postQuery = new QueryBuilder(Post.find(), query).search(['title']).filter().sort().paginate().fields();

      const result = await postQuery.modelQuery
            .populate({
                  path: 'author',
                  select: 'userName name email profile',
            })
            .populate({
                  path: 'category',
                  select: 'name',
            })
            .populate({
                  path: 'subCategory',
                  select: 'name',
            })

            .populate({
                  path: 'comments',
                  select: 'content author replies likes',
                  populate: [
                        {
                              path: 'author',
                              select: 'userName name email profile',
                        },
                        populateReplies,
                  ],
            });

      const meta = await postQuery.countTotal();

      return {
            meta,
            data: result,
      };
};

const getMyPostsFromDB = async (userId: string) => {
      const result = await Post.find({ author: userId })
            .populate({
                  path: 'author',
                  select: 'userName name email profile',
            })
            .populate({
                  path: 'comments',
                  select: 'content author replies likes createdAt',
                  populate: [
                        {
                              path: 'author',
                              select: 'userName name email profile',
                        },
                        populateReplies,
                  ],
            });
      return result;
};
const getSinglePostFromDB = async (id: string) => {
      const result = await Post.findOneAndUpdate({ _id: id }, { $inc: { views: 1 } }, { new: true })

            .populate({
                  path: 'author',
                  select: 'userName name email profile',
            })
            .populate({
                  path: 'comments',
                  select: 'content author replies likes createdAt',
                  populate: [
                        {
                              path: 'author',
                              select: 'userName name email profile',
                        },
                        populateReplies,
                  ],
            });
      if (!result) {
            throw new Error('Post not found');
      }
      return result;
};

const getMyLikedPostFromDB = async (userId: string) => {
      const result = await Post.find({ likes: { $in: [userId] } }).select('_id');

      return result;
};

const getAllPostByUserIdFromDB = async (userId: string) => {
      const result = await Post.find({ author: userId })
            .populate({
                  path: 'author',
                  select: 'userName name email profile',
            })
            .populate({
                  path: 'comments',
                  select: 'content author replies likes createdAt',
                  populate: [
                        {
                              path: 'author',
                              select: 'userName name email profile',
                        },
                        populateReplies,
                  ],
            });
      return result;
};
const deletePostFromDB = async (id: string) => {
      const session = await mongoose.startSession();
      try {
            session.startTransaction();
            const result = await Post.findOne({ _id: id }).session(session);
            if (!result) {
                  throw new Error('Post not found');
            }
            const deletedPost = await Post.findOneAndUpdate({ _id: id }, { status: 'deleted' }, { new: true, session });
            await Report.deleteMany({ postId: id }).session(session);
            await session.commitTransaction();
            return deletedPost;
      } catch (error) {
            await session.abortTransaction();
            throw error;
      } finally {
            session.endSession();
      }
};
export const PostService = {
      createPostIntoDB,
      getAllPostsFromDB,
      getSinglePostFromDB,
      getMyPostsFromDB,
      updatePostIntoDB,
      likePostIntoDB,
      deletePostFromDB,
      getMyLikedPostFromDB,
      getAllPostByUserIdFromDB,
};
