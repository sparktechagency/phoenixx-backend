import { Package } from './package.model';
import { IPackage } from './package.interface';
import stripe from '../../config/stripe.config';

const createPackageToDB = async (payload: Partial<IPackage>) => {
      const product = await stripe.products.create({
            name: payload.name as string,
            description: payload.description,
      });
      if (payload.price === undefined) {
            throw new Error('Price is required');
      }
      if (!payload.interval) {
      }

      const price = await stripe.prices.create({
            product: product.id,
            unit_amount: payload.price * 100,
            currency: 'usd',
            recurring: { interval: payload.interval as 'month' | 'year' },
      });

      const newPackage = new Package({
            ...payload,
            stripePriceId: price.id,
            stripeProductId: product.id,
      });

      return newPackage.save();
};

const updatePackageInDB = async (packageId: string, payload: Partial<IPackage>) => {
      const existingPackage = await Package.findById(packageId);

      if (!existingPackage) {
            throw new Error('Package not found');
      }

      await stripe.products.update(existingPackage.stripeProductId, {
            name: payload.name || existingPackage.name,
            description: payload.description || existingPackage.description,
      });

      if (payload.price || payload.interval) {
            const newPrice = await stripe.prices.create({
                  product: existingPackage.stripeProductId,
                  unit_amount: (payload.price || existingPackage.price) * 100,
                  currency: 'usd',
                  recurring: {
                        interval: (payload.interval || existingPackage.interval) as 'month' | 'year',
                  },
            });

            await stripe.prices.update(existingPackage.stripePriceId, {
                  active: false,
            });

            payload.stripePriceId = newPrice.id;
      }

      const updatedPackage = await Package.findByIdAndUpdate(packageId, payload, { new: true });

      return updatedPackage;
};

const deletePackageFromDB = async (packageId: string) => {
      const existingPackage = await Package.findById(packageId);

      if (!existingPackage) {
            throw new Error('Package not found');
      }

      await stripe.products.update(existingPackage.stripeProductId, {
            active: false,
      });

      await stripe.prices.update(existingPackage.stripePriceId, {
            active: false,
      });

      const deletedPackage = await Package.findOneAndDelete({ _id: packageId });

      return deletedPackage;
};
const getAllPackageFromDB = async () => {
      return await Package.find({ status: 'active' });
};
export const PackageService = {
      createPackageToDB,
      updatePackageInDB,
      getAllPackageFromDB,
      deletePackageFromDB,
};
