import { Types } from 'mongoose';

export type IComment = {
      postId: Types.ObjectId;
      author: Types.ObjectId;
      content: string;
      status: 'active' | 'deleted';
      likes: Types.ObjectId[];
      replies: Types.ObjectId[];
};
