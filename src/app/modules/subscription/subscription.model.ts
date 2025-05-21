import { model, Schema } from 'mongoose';
import { ISubscription } from './subscription.interface';

const subscriptionSchema = new Schema<ISubscription>(
      {
            stripeCustomerId: {
                  type: String,
                  required: true,
            },
            price: {
                  type: Number,
                  required: true,
            },
            user: {
                  type: Schema.Types.ObjectId,
                  ref: 'User',
                  required: true,
            },
            package: {
                  type: Schema.Types.ObjectId,
                  ref: 'Package',
                  required: true,
            },
            trxId: {
                  type: String,
                  required: true,
            },
            subscriptionId: {
                  type: String,
                  required: true,
            },
            currentPeriodStart: {
                  type: String,
                  required: true,
            },
            currentPeriodEnd: {
                  type: String,
                  required: true,
            },

            status: {
                  type: String,
                  enum: ['expired', 'active', 'canceled'],
                  default: 'active',
                  required: true,
            },
      },
      {
            timestamps: true,
      }
);

export const Subscription = model<ISubscription>('Subscription', subscriptionSchema);
