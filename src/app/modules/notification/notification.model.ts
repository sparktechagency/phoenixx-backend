import { model, Schema } from 'mongoose';
import { INotification } from './notification.interface';

const notificationSchema = new Schema<INotification>(
      {
            recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
            sender: { type: Schema.Types.ObjectId, ref: 'User' },
            followerId: {
                  type: Schema.Types.ObjectId,
                  ref: 'User',
                  default: null,
            },
            postId: {
                  type: String,
                  default: '',
            },
            commentId: {
                  type: String,
                  default: '',
            },
            type: {
                  type: String,
                  enum: [
                        'comment',
                        'report',
                        'like',
                        'follow',
                        'error',
                        'success',
                        'info',
                        'post',
                        'reply',
                        'warning',
                        'new_post_from_following',
                        'new_follower',
                        'comment_reply',
                  ],
                  default: 'info',
            },
            title: { type: String, required: true },
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
