import mongoose, { Schema } from 'mongoose';
import { IFAQ } from './faq.interface';

const faqSchema = new Schema<IFAQ>(
      {
            category: {
                  type: Schema.Types.ObjectId,
                  ref: 'FaqCategory',
                  required: true,
            },
            question: {
                  type: String,
                  required: true,
            },
            answer: {
                  type: String,
                  required: true,
            },
      },
      {
            timestamps: true,
      }
);

export const FAQ = mongoose.model<IFAQ>('FAQ', faqSchema);
