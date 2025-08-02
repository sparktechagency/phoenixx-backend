import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { FeedbackService } from './feedback.service';

const createFeedback = catchAsync(async (req, res) => {
      const user = req.user;
      const feedbackData = req.body;
      feedbackData.user = user.id;

      const result = await FeedbackService.createFeedbackIntoDB(feedbackData);
      sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Feedback created successfully',
            data: result,
      });
});

const getAllFeedbacks = catchAsync(async (req, res) => {
      const result = await FeedbackService.getAllFeedbacksFromDB(req.query);
      sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Feedbacks retrieved successfully',
            data: result,
      });
});

const deleteFeedback = catchAsync(async (req, res) => {
      const { feedbackId } = req.params;
      const result = await FeedbackService.deleteFeedbackFromDB(feedbackId);
      sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Feedback deleted successfully',
            data: result,
      });
});


export const FeedbackController = {
      createFeedback,
      getAllFeedbacks,
      deleteFeedback
};
