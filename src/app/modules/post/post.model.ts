import { model, Schema } from 'mongoose';
import { IPost } from './post.interface';

const postSchema = new Schema<IPost>(
      {
            title: {
                  type: String,
                  required: true,
            },
            slug: {
                  type: String,
                  required: true,
                  unique: true,
            },
            content: {
                  type: String,
                  required: true,
            },
            images: {
                  type: [String],
                  required: false,
            },
            status: {
                  type: String,
                  enum: ['active', 'deleted'],
                  default: 'active',
            },
            category: {
                  type: Schema.Types.ObjectId,
                  ref: 'Category',
                  required: true,
            },
            subCategory: {
                  type: Schema.Types.ObjectId,
                  ref: 'Subcategory',
                  required: false,
            },
            author: {
                  type: Schema.Types.ObjectId,
                  ref: 'User',
                  required: true,
            },
            comments: [
                  {
                        type: Schema.Types.ObjectId,
                        ref: 'Comment',
                  },
            ],
            likes: [
                  {
                        type: Schema.Types.ObjectId,
                        ref: 'User',
                  },
            ],
            views: {
                  type: Number,
                  default: 0,
            },
      },
      {
            timestamps: true,
      }
);

postSchema.pre('find', function (next) {
      this.find({ status: { $ne: 'deleted' } });
      next();
});
postSchema.pre('findOne', function (next) {
      this.find({ status: { $ne: 'deleted' } });
      next();
});

export const Post = model<IPost>('Post', postSchema);
