import config from '../../../config';
import stripe from '../../config/stripe.config';
import { Package } from '../package/package.model';
import { User } from '../user/user.model';
import { Subscription } from './subscription.model';

const createSubscriptionToDB = async (userId: string, payload: { packageId: string }) => {
      const existingSubscription = await Subscription.findOne({ user: userId, status: 'active' });

      if (existingSubscription) {
            throw new Error('Subscription already exists');
      }

      const packageDoc = await Package.findById(payload.packageId);

      if (!packageDoc) {
            throw new Error('Package not found');
      }

      const user = await User.findById(userId).select('+stripeCustomerId');

      if (!user || !user.stripeCustomerId) {
            throw new Error('User or Stripe Customer ID not found');
      }

      const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            customer: user.stripeCustomerId,
            line_items: [
                  {
                        price: packageDoc.stripePriceId,
                        quantity: 1,
                  },
            ],
            metadata: {
                  userId,
                  packageId: packageDoc._id.toString(),
            },
            success_url: config.frontend_url,
            cancel_url: config.frontend_url,
      });

      return {
            url: session.url,
      };
};

const upgradeSubscriptionToDB = async (userId: string, payload: { packageId: string }) => {
      const activeSubscription = await Subscription.findOne({
            user: userId,
            status: 'active',
      });

      if (!activeSubscription || !activeSubscription.subscriptionId) {
            throw new Error('No active subscription found to upgrade');
      }

      const packageDoc = await Package.findById(payload.packageId);

      if (!packageDoc || !packageDoc.stripePriceId) {
            throw new Error('Package not found or missing Stripe Price ID');
      }

      const user = await User.findById(userId).select('+stripeCustomerId');

      if (!user || !user.stripeCustomerId) {
            throw new Error('User or Stripe Customer ID not found');
      }

      const stripeSubscription = await stripe.subscriptions.retrieve(activeSubscription.subscriptionId);
      console.log(stripeSubscription, 'this is stripe subscription existing');

      await stripe.subscriptions.update(activeSubscription.subscriptionId, {
            items: [
                  {
                        id: stripeSubscription.items.data[0].id,
                        price: packageDoc.stripePriceId,
                  },
            ],
            proration_behavior: 'create_prorations',
            metadata: {
                  userId,
                  packageId: packageDoc._id.toString(),
            },
      });

      const portalSession = await stripe.billingPortal.sessions.create({
            customer: user.stripeCustomerId,
            return_url: config.frontend_url,
            flow_data: {
                  type: 'subscription_update',
                  subscription_update: {
                        subscription: activeSubscription.subscriptionId,
                  },
            },
      });

      return {
            url: portalSession.url,
      };
};

const cancelSubscriptionToDB = async (userId: string) => {
      const activeSubscription = await Subscription.findOne({ user: userId, status: 'active' });
      if (!activeSubscription || !activeSubscription.subscriptionId) {
            throw new Error('No active subscription found to cancel');
      }

      await stripe.subscriptions.cancel(activeSubscription.subscriptionId);

      await Subscription.findOneAndUpdate({ user: userId, status: 'active' }, { status: 'canceled' }, { new: true });

      return { success: true, message: 'Subscription canceled successfully' };
};

export const SubscriptionService = {
      createSubscriptionToDB,
      upgradeSubscriptionToDB,
      cancelSubscriptionToDB,
};
