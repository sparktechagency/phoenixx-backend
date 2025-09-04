import { ISavePost } from './save-post.interface';
import { SavePost } from './save-post.model';

const savePostToDB = async (payload: ISavePost) => {
      const isExist = await SavePost.findOne({
            userId: payload.userId,
            postId: payload.postId,
      });
      if (isExist) {
            await SavePost.findOneAndDelete({
                  userId: payload.userId,
                  postId: payload.postId,
            });
            return null;
      } else {
            const result = await SavePost.create(payload);
            return result;
      }
};

const getAllSavedPostsByUser = async (userId: string) => {
      // Simply find all saved posts by the user and populate the post details
      const result = await SavePost.find({ userId: userId }).populate({
            path: 'postId',
            select: '_id title slug images author category subCategory comments likes views',
            populate: [
                  {
                        path: 'author',
                        select: 'userName name email profile',
                  },
                  {
                        path: 'subCategory',
                        select: 'name slug',
                  },
                  {

                        path: 'category',
                        select: 'name slug',

                  },
            ],
      });

      return result;
};

export const SavePostService = {
      savePostToDB,
      getAllSavedPostsByUser,
};
