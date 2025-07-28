import ApiError from '../../../errors/ApiError';
import { Follow } from './follow.model';

const subscribe = async (subscriberId: string, subscribedToId: string) => {
      // Check if already subscribed
      const existingSubscription = await Follow.findOne({ subscriber: subscriberId, subscribedTo: subscribedToId });
      if (existingSubscription) {
            throw new ApiError(400, 'You are already subscribed to this user.');
      }

      // Create a new subscription
      const follow = new Follow({
            subscriber: subscriberId,
            subscribedTo: subscribedToId,
      });

      await follow.save();
      return follow;
};
// Unsubscribe from a user
const unsubscribe = async (subscriberId: string, subscribedToId: string) => {
      // Check if the user is subscribed
      const existingSubscription = await Follow.findOneAndDelete({
            subscriber: subscriberId,
            subscribedTo: subscribedToId,
      });

      if (!existingSubscription) {
            throw new ApiError(400, 'You are not subscribed to this user.');
      }
      return existingSubscription;
};
// Get all subscribers of a specific user
const getSubscribers = async (userId: string) => {
      const subscribers = await Follow.find({ subscribedTo: userId }).populate('subscriber', 'name');
      return subscribers.map((sub) => sub.subscriber); // Return an array of subscribers
};

const isUserSubscribed = async (id: string, userId: string) => {
      // Fetch subscriptions of the user (you only need to check if the specific user is in the list)
      const subscriptions = await Follow.find({ subscriber: userId }).populate('subscribedTo', 'name');
      // Check if the user with the specific id is subscribed
      // const isSubscribed = subscriptions.some((sub) => sub.subscribedTo.toString() === id.toString());
      // Only return whether the user is subscribed, no need to return the full list of subscriptions
      return subscriptions;
};

export const FollowService = {
      subscribe,
      unsubscribe,
      getSubscribers,
      isUserSubscribed,
};
