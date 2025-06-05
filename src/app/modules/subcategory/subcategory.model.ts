import { model, Schema } from 'mongoose';
import { ISubcategory } from './subcategory.interface';

const subcategorySchema = new Schema<ISubcategory>(
      {
            categoryId: {
                  type: Schema.Types.ObjectId,
                  ref: 'Category',
                  required: true,
            },
            name: { type: String, required: true, maxlength: 20 },
            description: { type: String, required: true },
            image: { type: String, required: true },
            darkImage: { type: String, required: true },
            status: { type: String, enum: ['active', 'deleted'], default: 'active' },
      },
      { timestamps: true }
);

export const Subcategory = model<ISubcategory>('Subcategory', subcategorySchema);
