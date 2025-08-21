import { Model, Types } from 'mongoose';
import { USER_ROLES } from '../../../enums/user';

export type IUser = {
      _id: any;
      name: string;
      userName: string;
      maxChangeUserName: number;

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
      // ✅ Online Status Interface
      onlineStatus?: {
            isOnline?: boolean;
            lastSeen?: Date;
            lastHeartbeat?: Date;
      };
};

export type UserModal = {
      isExistUserById(id: string): any;
      isExistUserByEmail(email: string): any;
      isMatchPassword(password: string, hashPassword: string): boolean;
      // ✅ Online Status Methods
      setUserOnline(userId: string): Promise<void>;
      setUserOffline(userId: string): Promise<void>;
      updateHeartbeat(userId: string): Promise<void>;
      getOnlineUsers(): Promise<IUser[]>;
      bulkUserStatus(userIds: string[]): Promise<IUser[]>;
} & Model<IUser>;
