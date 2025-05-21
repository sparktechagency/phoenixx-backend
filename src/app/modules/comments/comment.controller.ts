import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { CommentService } from './comment.service';

const createComment = catchAsync(async (req, res) => {
      const user = req.user;
      const commentData = {
            ...req.body,
            author: user?.id,
      };
      const result = await CommentService.createCommentIntoDB(commentData);
      sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Comment created successfully',
            data: result,
      });
});
const getMyComments = catchAsync(async (req, res) => {
      const id = req.user.id;
      const result = await CommentService.getMyCommentedPost(id);
      sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Comments fetched successfully',
            data: result,
      });
});

const updateComment = catchAsync(async (req, res) => {
      const id = req.user.id;
      const commentId = req.params.id;
      const commentData = req.body;
      const result = await CommentService.updateCommentIntoDB(id, commentId, commentData);
      sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Comment updated successfully',
            data: result,
      });
});
const replayComment = catchAsync(async (req, res) => {
      const id = req.user.id;
      const commentId = req.params.id;
      const commentData = {
            ...req.body,
            author: id,
      };

      const result = await CommentService.replayCommentIntoDB(commentId, commentData);
      sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Comment replied successfully',
            data: result,
      });
});

const likeComment = catchAsync(async (req, res) => {
      const id = req.user.id;
      const commentId = req.params.id;
      const result = await CommentService.likeCommentFromDB(id, commentId);
      sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Comment liked updated successfully',
            data: result,
      });
});
const deleteComment = catchAsync(async (req, res) => {
      const id = req.user.id;
      const commentId = req.params.id;
      const result = await CommentService.deleteCommentFromDB(id, commentId);
      sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Comment deleted successfully',
            data: result,
      });
});

export const CommentController = {
      createComment,
      updateComment,
      deleteComment,
      replayComment,
      likeComment,
      getMyComments,
};
