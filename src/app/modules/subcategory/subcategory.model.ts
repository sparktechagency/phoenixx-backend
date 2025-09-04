import { Aggregate, model, Schema } from 'mongoose';
import { ISubcategory } from './subcategory.interface';

const subcategorySchema = new Schema<ISubcategory>(
      {
            categoryId: {
                  type: Schema.Types.ObjectId,
                  ref: 'Category',
                  required: true,
            },
            name: { type: String, required: true, maxlength: 40 },
            slug: { type: String, required: true, unique: true },
            description: { type: String, required: true },
            image: { type: String, required: true },
            darkImage: { type: String, required: true },
            status: { type: String, enum: ['active', 'deleted'], default: 'active' },
      },
      { timestamps: true }
);
// filter out deleted documents
subcategorySchema.pre('find', function (next) {
      this.find({ status: { $ne: "deleted" } });
      next();
});
subcategorySchema.pre('findOne', function (next) {
      this.find({ status: { $ne: "deleted" } });
      next();
});
subcategorySchema.pre('aggregate', function (this: Aggregate<ISubcategory>, next) {
      this.pipeline().unshift({ $match: { status: { $ne: "deleted" } } });
      next();
});
export const Subcategory = model<ISubcategory>('Subcategory', subcategorySchema);
