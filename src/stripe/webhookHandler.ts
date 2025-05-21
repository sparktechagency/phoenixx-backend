import { Request, Response } from 'express';
import Stripe from 'stripe';
import mongoose from 'mongoose';
import stripe from '../app/config/stripe.config';
import { User } from '../app/modules/user/user.model';
import { Package } from '../app/modules/package/package.model';
import { Subscription } from '../app/modules/subscription/subscription.model';

const webhookHandler = async (req: Request, res: Response) => {
      const sig = req.headers['stripe-signature'];
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

      if (!webhookSecret) {
            console.error('Stripe webhook secret not set');
            return res.status(500).send('Webhook secret not configured');
      }

      let event: Stripe.Event;
      try {
            event = stripe.webhooks.constructEvent(req.body, sig as string, webhookSecret);
      } catch (err: any) {
            console.error('Webhook signature verification failed:', err.message);
            return res.status(400).send(`Webhook Error: ${err.message}`);
      }

      switch (event.type) {
            case 'invoice.payment_succeeded':
                  await handlePaymentSucceeded(event.data.object);
                  break;
            case 'customer.subscription.updated':
                  await handleSubscriptionUpdated(event.data.object);
                  break;
            case 'customer.subscription.deleted':
                  await handleSubscriptionCancelled(event.data.object);
                  break;
            default:
                  // Handle any other event
                  break;
      }

      res.status(200).json({ received: true });
};

export default webhookHandler;

const handlePaymentSucceeded = async (invoice: Stripe.Invoice) => {
      const user = await User.findOne({ stripeCustomerId: invoice.customer });
      const priceId = invoice.lines.data[0]?.price?.id;
      const packageDoc = await Package.findOne({ stripePriceId: priceId });

      if (!user || !packageDoc) {
            console.error('User or Package not found');
            return;
      }

      const trxId = invoice.payment_intent || invoice.charge;
      await Subscription.create({
            stripeCustomerId: invoice.customer,
            price: packageDoc.price,
            user: user._id,
            package: packageDoc._id,
            trxId,
            subscriptionId: invoice.subscription as string,
            currentPeriodStart: new Date(invoice.period_start * 1000),
            currentPeriodEnd: new Date(invoice.period_end * 1000),
            status: 'active',
      });
};

const handleSubscriptionUpdated = async (subscription: Stripe.Subscription) => {
      const user = await User.findOne({ stripeCustomerId: subscription.customer });
      const packageDoc = await Package.findOne({ stripePriceId: subscription.items.data[0]?.price?.id });

      if (!user || !packageDoc) {
            console.error('User or Package not found');
            return;
      }

      const activeSubscription = await Subscription.findOne({ user: user._id, status: 'active' });
      if (!activeSubscription) {
            console.error('Active subscription not found');
            return;
      }

      await Subscription.findOneAndUpdate(
            { user: user._id, status: 'active' },
            {
                  price: packageDoc.price,
                  package: packageDoc._id,
                  status: subscription.status,
                  currentPeriodStart: new Date(subscription.current_period_start * 1000),
                  currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            },
            { new: true }
      );

      console.log('Subscription updated successfully');
};

const handleSubscriptionCancelled = async (subscription: Stripe.Subscription) => {
      const user = await User.findOne({ stripeCustomerId: subscription.customer });

      if (!user) {
            console.error('User not found for subscription cancellation');
            return;
      }

      await Subscription.findOneAndUpdate({ user: user._id, status: 'active' }, { status: 'canceled' }, { new: true });

      console.log(`Subscription for user ${user.email} cancelled successfully`);
};
