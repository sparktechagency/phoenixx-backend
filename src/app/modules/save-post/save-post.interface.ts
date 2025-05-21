import { Types } from 'mongoose';

export interface ISavePost {
      userId: Types.ObjectId;
      postId: Types.ObjectId;
}
