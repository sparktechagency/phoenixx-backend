import { StatusCodes } from 'http-status-codes';
import QueryBuilder from '../../../builder/QueryBuilder';
import ApiError from '../../../errors/ApiError';
import { IFeedback } from './feedback.interface';
import { Feedback } from './feedback.model';

const createFeedbackIntoDB = async (payload: IFeedback) => {
      const result = await Feedback.create(payload);
      if (!result) {
            throw new Error('Failed to create feedback');
      }
      return result;
};

const getAllFeedbacksFromDB = async (query: Record<string, any>) => {
      const feedbackQuery = new QueryBuilder(Feedback.find().populate('userId', "name email userName profile"), query)
            .search(['likedAspects'])
            .filter()
            .sort()
            .paginate();

      const result = await feedbackQuery.modelQuery;
      const total = await feedbackQuery.countTotal();
      return {
            data: result,
            meta: total,
      };
};

const deleteFeedbackFromDB = async (feedbackId: string) => {
      const result = await Feedback.findByIdAndDelete(feedbackId);
      if (!result) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Feedback not found');
      }
      return result;
};

export const FeedbackService = {
      createFeedbackIntoDB,
      getAllFeedbacksFromDB,
      deleteFeedbackFromDB
};
