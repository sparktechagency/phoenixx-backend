import { Types } from 'mongoose';

export interface IFAQ {
      category: Types.ObjectId;
      question: string;
      answer: string;
}
