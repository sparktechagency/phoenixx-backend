import { ObjectId } from 'mongoose';

export type ISubscription = {
      stripeCustomerId: string;
      price: number;
      user: ObjectId;
      package: ObjectId;
      trxId: string;
      subscriptionId: string;
      currentPeriodStart: string;
      currentPeriodEnd: string;
      remaining: number;
      status: 'expired' | 'active' | 'cancel';
};
