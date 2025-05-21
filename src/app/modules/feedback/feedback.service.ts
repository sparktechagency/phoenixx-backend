import QueryBuilder from '../../../builder/QueryBuilder';
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
      const feedbackQuery = new QueryBuilder(Feedback.find(), query)
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
export const FeedbackService = {
      createFeedbackIntoDB,
      getAllFeedbacksFromDB,
};
