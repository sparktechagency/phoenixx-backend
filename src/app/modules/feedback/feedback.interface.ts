import { ObjectId } from 'mongoose';

export interface IFeedback {
      user: ObjectId;
      likedAspects: string;
      areasForImprovement: string;
      featureSuggestions: string;
      additionalFeedback: string;
}
