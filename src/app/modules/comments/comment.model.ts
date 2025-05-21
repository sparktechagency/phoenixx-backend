import { model, Schema } from 'mongoose';
import { IComment } from './comment.interface';

const commentSchema = new Schema<IComment>(
      {
            postId: {
                  type: Schema.Types.ObjectId,
                  ref: 'Post',
                  required: true,
            },
            author: {
                  type: Schema.Types.ObjectId,
                  ref: 'User',
                  required: true,
            },
            content: {
                  type: String,
                  required: true,
            },
            status: { type: String, enum: ['active', 'deleted'], default: 'active' },
            likes: [
                  {
                        type: Schema.Types.ObjectId,
                        ref: 'User',
                  },
            ],
            replies: [
                  {
                        type: Schema.Types.ObjectId,
                        ref: 'Comment',
                  },
            ],
      },
      {
            timestamps: true,
      }
);

export const Comment = model<IComment>('Comment', commentSchema);
