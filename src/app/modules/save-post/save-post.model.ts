import { model, Schema } from 'mongoose';
import { ISavePost } from './save-post.interface';
const savePostSchema = new Schema<ISavePost>(
      {
            userId: {
                  type: Schema.Types.ObjectId,
                  ref: 'User',
                  required: true,
            },
            postId: {
                  type: Schema.Types.ObjectId,
                  ref: 'Post',
                  required: true,
            },
      },
      {
            timestamps: true,
      }
);

export const SavePost = model<ISavePost>('SavePost', savePostSchema);
