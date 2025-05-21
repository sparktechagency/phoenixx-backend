import { ObjectId } from 'mongoose';

export type IComment = {
      postId: ObjectId;
      author: ObjectId;
      content: string;
      status: 'active' | 'deleted';
      likes: ObjectId[];
      replies: ObjectId[];
};
