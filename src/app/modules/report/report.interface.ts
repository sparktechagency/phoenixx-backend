import { Types } from 'mongoose';

export type IReport = {
      postId: Types.ObjectId;
      reporterId: Types.ObjectId;
      reason: string;
      description?: string;
      status: 'pending' | 'reviewed' | 'resolved';
};
