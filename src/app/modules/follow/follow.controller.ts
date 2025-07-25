import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { FollowService } from './follow.service';

const subscribe = catchAsync(async (req, res) => {
      const subscriberId = req.user.id;
      const { subscribedToId } = req.body;
      const follow = await FollowService.subscribe(subscriberId, subscribedToId);
      sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Subscription successful',
            data: follow,
      });
});
const unsubscribe = catchAsync(async (req, res) => {
      const subscriberId = req.user.id;
      const { subscribedToId } = req.body;
      const follow = await FollowService.unsubscribe(subscriberId, subscribedToId);
      sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Unsubscribed successful',
            data: follow,
      });
});
const getSubscriptions = catchAsync(async (req, res) => {
      const { id } = req.user;
      const { userId } = req.params;
      const subscribers = await FollowService.isUserSubscribed(id, userId);
      sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Subscriptions retrieved successfully',
            data: subscribers,
      });
});
export const FollowController = {
      subscribe,
      unsubscribe,
      getSubscriptions,
};
