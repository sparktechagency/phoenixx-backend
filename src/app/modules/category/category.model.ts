import { model, Schema } from 'mongoose';
import { ICategory } from './category.interface';

const categorySchema = new Schema<ICategory>(
      {
            name: { type: String, required: true },
            description: { type: String },
            image: { type: String, required: true },
            status: { type: String, enum: ['active', 'deleted'], default: 'active' },
      },
      {
            timestamps: true,
      }
);

categorySchema.pre('find', function (next) {
      this.where({ status: { $ne: 'deleted' } });
      next();
});
categorySchema.pre('findOne', function (next) {
      this.where({ status: { $ne: 'deleted' } });
      next();
});
categorySchema.virtual('subcategories', {
      ref: 'Subcategory',
      localField: '_id',
      foreignField: 'categoryId',
});
categorySchema.set('toJSON', { virtuals: true });
categorySchema.set('toObject', { virtuals: true });
export const Category = model<ICategory>('Category', categorySchema);
