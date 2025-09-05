import QueryBuilder from '../../../builder/QueryBuilder';
import unlinkFile from '../../../shared/unlinkFile';
import { IPost } from './post.interface';
import { Post } from './post.model';
import { NotificationService } from '../notification/notification.service';
import mongoose, { Types } from 'mongoose';
import { User } from '../user/user.model';
import { Report } from '../report/report.model';
import { Follow } from '../follow/follow.model';
import slugify from 'slugify';
import { SavePost } from '../save-post/save-post.model';

const populateReplies = {
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
const createUniqueSlug = async (title: string, excludeId?: string): Promise<string> => {
  let baseSlug = slugify(title, { lower: true });
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    // Create a fresh query object for each iteration
    const query: any = { slug };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }

    // Check if this slug exists
    const existingPost = await Post.findOne(query);
    
    if (!existingPost) {
      // Slug is unique, return it
      return slug;
    }

    // Slug exists, try next variation
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
};

const createPostIntoDB = async (payload: IPost, files: any) => {
      const user = await User.findById(payload.author);
      if (!user) {
            throw new Error('You are not logged in');
      }

      if (files?.image?.length > 0) {
            payload.images = files.image?.map((file: any) => `/images/${file.filename}`);
      }
      payload.userName = user.userName;
      payload.slug = await createUniqueSlug(payload.title);
      const result = await Post.create(payload);

      if (result.author) {
            const io = (global as any).io;
            const notifications = [];

            // 1. Create author notification
            const authorNotification = await NotificationService.createNotificationToDB({
                  recipient: new Types.ObjectId(result.author.toString()),
                  postId: result.slug,
                  type: 'post',
                  title: 'New Post Created',
                  message: `Your post has created successfully`,
                  read: false,
            });

            // Emit author notification
            if (io) {
                  io.emit(`notification::${result.author.toString()}`, authorNotification);
                  console.log('📤 Author notification sent');
            }

            const followers = await Follow.find({
                  subscribedTo: result.author,
                  subscriber: { $ne: result.author },
            }).populate('subscriber', 'userName');

            console.log('👥 Followers found:', followers.length);

            // 3. Create and emit follower notifications
            if (followers.length > 0) {
                  for (const follow of followers) {
                        try {
                              const followerNotification = await NotificationService.createNotificationToDB({
                                    recipient: new Types.ObjectId((follow.subscriber as any)._id.toString()),
                                    postId: result.slug,
                                    type: 'new_post_from_following',
                                    title: 'New Post from Someone You Follow',
                                    message: `${user.userName} has created a new post`,
                                    read: false,
                              });

                              // Emit individual follower notification
                              if (io) {
                                    const eventName = `notification::${(follow.subscriber as any)._id.toString()}`;
                                    io.emit(eventName, followerNotification);
                                    console.log(`📤 Notification sent to: ${follow.subscriber}`);
                              }
                        } catch (error) {
                              console.error(`❌ Error creating notification for follower ${follow.subscriber}:`, error);
                        }
                  }
            } else {
                  console.log('⚠️ No followers found');
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

      // Handle slug update if title is changed
      if (payload.title && payload.title !== existingPost.title) {
            payload.slug = await createUniqueSlug(payload.title, id);
            console.log(`🔄 Slug updated: ${existingPost.slug} → ${payload.slug}`);
      }

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
      if (existingPost.author && existingPost.author.toString() !== userId) {
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
      let postQuery;

      if (query.searchTerm && typeof query.searchTerm === 'string' && query.searchTerm.trim()) {
            const searchTerm = query.searchTerm.trim();

            const users = await User.find({
                  $or: [
                        { userName: { $regex: searchTerm, $options: 'i' } },
                        { name: { $regex: searchTerm, $options: 'i' } }
                  ]
            }).select('_id');

            const userIds = users.map(user => user._id);

            const searchConditions = {
                  $or: [
                        { title: { $regex: searchTerm, $options: 'i' } },
                        ...(userIds.length > 0 ? [{ author: { $in: userIds } }] : [])
                  ]
            };

            const modifiedQuery = { ...query };
            delete modifiedQuery.searchTerm;

            postQuery = new QueryBuilder(
                  Post.find(searchConditions),
                  modifiedQuery
            ).filter().sort().paginate().fields();

      } else {
            postQuery = new QueryBuilder(Post.find(), query)
                  .search(['title'])
                  .filter()
                  .sort()
                  .paginate()
                  .fields();
      }

      const result = await postQuery.modelQuery
            .populate({
                  path: 'author',
                  select: 'userName name email profile',
            })
            .populate({
                  path: 'category',
                  select: 'name slug',
            })
            .populate({
                  path: 'subCategory',
                  select: 'name slug',
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

      const meta = await postQuery.countTotal();

      return {
            meta,
            data: result,
      };
};


// const getAllPostsFromDB = async (query: Record<string, any>) => {
//       const postQuery = new QueryBuilder(Post.find(), query).search(['title']).filter().sort().paginate().fields();

//       const result = await postQuery.modelQuery
//             .populate({
//                   path: 'author',
//                   select: 'userName name email profile',
//             })
//             .populate({
//                   path: 'category',
//                   select: 'name slug',
//             })
//             .populate({
//                   path: 'subCategory',
//                   select: 'name slug',
//             })

//             .populate({
//                   path: 'comments',
//                   select: 'content author replies likes',
//                   populate: [
//                         {
//                               path: 'author',
//                               select: 'userName name email profile',
//                         },
//                         populateReplies,
//                   ],
//             });

//       const meta = await postQuery.countTotal();

//       return {
//             meta,
//             data: result,
//       };
// };

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
const getSinglePostFromDB = async (slug: string) => {
      const result = await Post.findOneAndUpdate({ slug: slug }, { $inc: { views: 1 } }, { new: true })

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

const getAllPostByUserIdFromDB = async (userName: string) => {
      const result = await Post.find({ userName: userName })
            .populate({
                  path: 'author',
                  select: 'userName name email profile',
            })
            .populate({
                  path: 'category',
                  select: 'name slug',
            })
            .populate({
                  path: 'subCategory',
                  select: 'name slug',
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
            await SavePost.deleteMany({ postId: id }).session(session);
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
