import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { SubscriptionService } from './subscription.service';

const createSubscription = catchAsync(async (req: Request, res: Response) => {
      const result = await SubscriptionService.createSubscriptionToDB(req.user.id, req.body);
      sendResponse(res, {
            success: true,
            statusCode: StatusCodes.CREATED,
            message: 'Subscription  created successfully',
            data: result,
      });
});

const upgradeSubscription = catchAsync(async (req: Request, res: Response) => {
      const result = await SubscriptionService.upgradeSubscriptionToDB(req.user.id, req.body);
      sendResponse(res, {
            success: true,
            statusCode: StatusCodes.CREATED,
            message: 'Subscription  created successfully',
            data: result,
      });
});

const cancelSubscription = catchAsync(async (req: Request, res: Response) => {
      const result = await SubscriptionService.cancelSubscriptionToDB(req.user.id);
      sendResponse(res, {
            success: true,
            statusCode: StatusCodes.CREATED,
            message: 'Subscription  created successfully',
            data: result,
      });
});

export const SubscriptionController = {
      createSubscription,
      upgradeSubscription,
      cancelSubscription,
};
