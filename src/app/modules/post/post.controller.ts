import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { PostService } from './post.service';
import sendResponse from '../../../shared/sendResponse';

const createPost = catchAsync(async (req: Request, res: Response) => {
      const user = req.user;
      req.body.author = user.id;
      const result = await PostService.createPostIntoDB(req.body, req.files);
      sendResponse(res, {
            success: true,
            statusCode: 200,
            message: 'Post created successfully',
            data: result,
      });
});

const likePost = catchAsync(async (req: Request, res: Response) => {
      const { id } = req.params;
      const user = req.user;
      const result = await PostService.likePostIntoDB(id, user.id);
      sendResponse(res, {
            success: true,
            statusCode: 200,
            message: 'Post liked successfully',
            data: result,
      });
});
const updatePost = catchAsync(async (req: Request, res: Response) => {
      const { id } = req.params;
      const result = await PostService.updatePostIntoDB(id, req.body, req.files);
      sendResponse(res, {
            success: true,
            statusCode: 200,
            message: 'Post updated successfully',
            data: result,
      });
});

const getAllPosts = catchAsync(async (req: Request, res: Response) => {
      const result = await PostService.getAllPostsFromDB(req.query);
      sendResponse(res, {
            success: true,
            statusCode: 200,
            message: 'Posts fetched successfully',
            data: result,
      });
});
const getMyPosts = catchAsync(async (req: Request, res: Response) => {
      const user = req.user;
      const result = await PostService.getMyPostsFromDB(user.id);
      sendResponse(res, {
            success: true,
            statusCode: 200,
            message: 'My posts fetched successfully',
            data: result,
      });
});

const getMyLikedPost = catchAsync(async (req: Request, res: Response) => {
      const user = req.user;
      const result = await PostService.getMyLikedPostFromDB(user.id);
      sendResponse(res, {
            success: true,
            statusCode: 200,
            message: 'My liked posts fetched successfully',
            data: result,
      });
});

const getSinglePost = catchAsync(async (req: Request, res: Response) => {
      const { slug } = req.params;
      const result = await PostService.getSinglePostFromDB(slug);
      sendResponse(res, {
            success: true,
            statusCode: 200,
            message: 'Post fetched successfully',
            data: result,
      });
});

const getAllPostByUserId = catchAsync(async (req: Request, res: Response) => {
      const { userName } = req.params;
      const result = await PostService.getAllPostByUserIdFromDB(userName);
      sendResponse(res, {
            success: true,
            statusCode: 200,
            message: 'Posts fetched successfully',
            data: result,
      });
});
const deletePost = catchAsync(async (req: Request, res: Response) => {
      const { id } = req.params;
      const result = await PostService.deletePostFromDB(id);
      sendResponse(res, {
            success: true,
            statusCode: 200,
            message: 'Post deleted successfully',
            data: result,
      });
});
export const PostController = {
      createPost,
      getAllPosts,
      getSinglePost,
      getMyPosts,
      updatePost,
      likePost,
      deletePost,
      getMyLikedPost,
      getAllPostByUserId,
};
