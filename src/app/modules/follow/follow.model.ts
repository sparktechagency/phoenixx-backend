import { Schema, model } from 'mongoose';
import { IFollow } from './follow.interface';

const followSchema = new Schema<IFollow>({
      subscribedTo: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User',
      },
      subscriber: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User',
      },
      subscribedAt: {
            type: Date,
            default: Date.now,
      },
});

// Prevent duplicate subscriptions (a user cannot subscribe to the same user more than once)
followSchema.index({ subscriber: 1, subscribedTo: 1 }, { unique: true });

export const Follow = model<IFollow>('Follow', followSchema);
