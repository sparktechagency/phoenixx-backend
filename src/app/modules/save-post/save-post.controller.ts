import { Request, Response } from 'express';

import { SavePostService } from './save-post.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';

const savePost = catchAsync(async (req: Request, res: Response) => {
      const userId = req.user?.id as string;
      req.body.userId = userId;
      const result = await SavePostService.savePostToDB(req.body);

      sendResponse(res, {
            statusCode: 200,
            success: true,
            message: result ? 'Post saved successfully' : 'Post removed successfully',
            data: result,
      });
});

const getAllSavedPosts = catchAsync(async (req: Request, res: Response) => {
      const userId = req.user.id as string;
      const result = await SavePostService.getAllSavedPostsByUser(userId);

      sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Saved posts retrieved successfully',
            data: result,
      });
});

export const SavePostController = {
      savePost,
      getAllSavedPosts,
};
