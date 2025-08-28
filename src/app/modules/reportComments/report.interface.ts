import { Types } from 'mongoose';

export type IReportComment = {
      commentId: Types.ObjectId;
      reporterId: Types.ObjectId;
      reason: string;
      description?: string;
      status: 'pending' | 'reviewed' | 'resolved';
};
