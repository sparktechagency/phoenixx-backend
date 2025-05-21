import mongoose, { Schema } from 'mongoose';
import { IFaqCategory } from './faqCategory.interface';

const faqCategorySchema = new Schema<IFaqCategory>({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
}, {
    timestamps: true,
});

export const FaqCategory = mongoose.model<IFaqCategory>('FaqCategory', faqCategorySchema);
