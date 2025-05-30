import { Types } from 'mongoose';

export type INotification = {
      recipient: Types.ObjectId;
      sender?: Types.ObjectId;
      type: 'info' | 'warning' | 'success' | 'error';
      recipientRole: 'admin' | 'user';
      postId: string;
      commentId: string;
      message: string;
      link?: string;
      read: boolean;
};
