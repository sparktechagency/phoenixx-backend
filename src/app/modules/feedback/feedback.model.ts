import mongoose from 'mongoose';
import { IFeedback } from './feedback.interface';

const feedbackSchema = new mongoose.Schema<IFeedback>(
      {
            user: {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: 'User',
                  required: true,
            },
            likedAspects: {
                  type: String,
                  required: true,
            },
            areasForImprovement: {
                  type: String,
                  required: true,
            },
            featureSuggestions: {
                  type: String,
                  required: true,
            },
            additionalFeedback: {
                  type: String,
                  required: true,
            },
      },
      {
            timestamps: true,
      }
);

export const Feedback = mongoose.model<IFeedback>('Feedback', feedbackSchema);
