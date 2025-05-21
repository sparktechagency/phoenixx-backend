import { Model, Types } from 'mongoose';
import { USER_ROLES } from '../../../enums/user';

export type IUser = {
      _id: any;
      name: string;
      userName: string;
      stripeCustomerId: string | null;
      subscription: {
            subscriptionPackageId: Types.ObjectId;
            stripeSubscriptionId: string;
            status: 'active' | 'deleted';
            priceId: string;
      };
      role: USER_ROLES;
      contact: string;
      email: string;
      password: string;
      location: string;
      profile?: string;
      status: 'active' | 'delete';
      verified: boolean;
      authentication?: {
            isResetPassword: boolean;
            oneTimeCode: number;
            expireAt: Date;
      };
};

export type UserModal = {
      isExistUserById(id: string): any;
      isExistUserByEmail(email: string): any;
      isMatchPassword(password: string, hashPassword: string): boolean;
} & Model<IUser>;
