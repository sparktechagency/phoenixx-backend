import { Schema, model } from 'mongoose';
import { IPackage } from './package.interface';

const PackageSchema = new Schema<IPackage>(
      {
            name: { type: String, required: true, unique: true, maxlength: 20 },
            price: { type: Number, required: true },
            interval: { type: String, enum: ['month', 'year'] },
            description: { type: String, required: true },
            features: { type: [String], required: true },
            stripePriceId: { type: String, required: true },
            stripeProductId: { type: String, required: true },
            status: { type: String, enum: ['active', 'deleted'], default: 'active' },
      },
      { timestamps: true }
);

export const Package = model<IPackage>('Package', PackageSchema);
