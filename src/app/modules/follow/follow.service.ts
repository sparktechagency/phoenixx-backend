import { Types } from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { Follow } from './follow.model';
import { NotificationService } from '../notification/notification.service';
import { User } from '../user/user.model';

const subscribe = async (subscriberId: string, subscribedToId: string) => {
      // Check if already subscribed
      const existingSubscription = await Follow.findOne({ subscriber: subscriberId, subscribedTo: subscribedToId });
      if (existingSubscription) {
            throw new ApiError(400, 'You are already subscribed to this user.');
      }

      // Get user details for notification
      const subscriber = await User.findById(subscriberId);
      const subscribedToUser = await User.findById(subscribedToId);

      if (!subscriber || !subscribedToUser) {
            throw new ApiError(404, 'User not found');
      }

      // Create a new subscription
      const follow = new Follow({
            subscriber: subscriberId,
            subscribedTo: subscribedToId,
      });

      await follow.save();

      // Create notification for the user being followed
      const newFollowerNotification = await NotificationService.createNotificationToDB({
            recipient: new Types.ObjectId(subscribedToId),
            type: 'new_follower',
            title: 'New Follower',
            followerId: new Types.ObjectId(subscriberId),
            message: `${subscriber.userName} started following you`,
            read: false,
      });

      // Emit real-time notification
      //@ts-ignore
      const io = global.io;
      if (io) {
            io.emit(`notification::${subscribedToId}`, newFollowerNotification);
      }

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
