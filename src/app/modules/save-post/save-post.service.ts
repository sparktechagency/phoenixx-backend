import { Post } from '../post/post.model';
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

// ✅ সঠিক approach - Option 2: Post collection থেকে directly
const getAllSavedPostsByUser = async (userId: string) => {
      const savedPosts = await SavePost.find({ userId: userId }).select('postId');
      const postIds = savedPosts.map(saved => saved.postId);

      // Post collection থেকে directly posts নিন
      const posts = await Post.find({ _id: { $in: postIds } })
            .populate('author', 'userName name email profile')
            .populate('category', 'name slug')
            .populate('subCategory', 'name slug')
            .select('_id title slug images author category subCategory comments likes views');

      return posts;
};

export const SavePostService = {
      savePostToDB,
      getAllSavedPostsByUser,
};
