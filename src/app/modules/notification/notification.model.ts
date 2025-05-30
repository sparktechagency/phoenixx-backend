import { model, Schema } from 'mongoose';
import { INotification } from './notification.interface';

const notificationSchema = new Schema<INotification>(
      {
            recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
            sender: { type: Schema.Types.ObjectId, ref: 'User' },
            postId: {
                  type: String,
                  default: '',
            },
            commentId: {
                  type: String,
                  default: '',
            },
            type: { type: String, enum: ['info', 'warning', 'success', 'error'], default: 'info' },
            recipientRole: { type: String, enum: ['admin', 'user'], default: 'user' },
            message: { type: String, required: true },
            link: { type: String },
            read: { type: Boolean, default: false },
      },
      {
            timestamps: true,
      }
);

export const Notification = model<INotification>('Notification', notificationSchema);
