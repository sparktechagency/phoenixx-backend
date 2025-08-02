import { Types } from 'mongoose';

export type IChat = {
      participants: Types.ObjectId[];
      lastMessage: Types.ObjectId;
      read: boolean;
      deletedBy: [Types.ObjectId];
      isDeleted: boolean;
      status: 'active' | 'deleted';
      readBy: Types.ObjectId[];
      // New fields for additional features
      mutedBy: Types.ObjectId[]; // Users who muted this chat
      blockedUsers: {
            // Blocking relationships within this chat
            blocker: Types.ObjectId;
            blocked: Types.ObjectId;
            blockedAt: Date;
      }[];
      userPinnedMessages: {
            userId: Types.ObjectId;
            pinnedMessages: Types.ObjectId[];
      }[];
};
