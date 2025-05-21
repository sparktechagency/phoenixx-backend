import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { NotificationService } from './notification.service';
import sendResponse from '../../../shared/sendResponse';

const createNotification = catchAsync(async (req: Request, res: Response) => {
      const notification = await NotificationService.createNotificationToDB(req.body);
      sendResponse(res, {
            success: true,
            statusCode: 200,
            message: 'Notification created successfully',
            data: notification,
      });
});
const getMyNotifications = catchAsync(async (req: Request, res: Response) => {
      const notifications = await NotificationService.getUserNotifications(req.user.id, req.query);
      sendResponse(res, {
            success: true,
            statusCode: 200,
            message: 'Notifications retrieved successfully',
            data: notifications,
      });
});

const markAllNotificationsAsRead = catchAsync(async (req: Request, res: Response) => {
      console.log('req.user', req.user);
      const notifications = await NotificationService.markAllNotificationsAsReadInToDB(req.user.id);
      sendResponse(res, {
            success: true,
            statusCode: 200,
            message: 'All notifications marked as read successfully',
            data: notifications,
      });
});

const markSingleNotificationAsRead = catchAsync(async (req: Request, res: Response) => {
      const { id } = req.params;
      const notification = await NotificationService.markSingleNotificationAsRead(id);
      sendResponse(res, {
            success: true,
            statusCode: 200,
            message: 'Notification marked as read successfully',
            data: notification,
      });
});

const deleteSingleNotification = catchAsync(async (req: Request, res: Response) => {
      const { id } = req.params;
      const notification = await NotificationService.deleteSingleNotification(id);
      sendResponse(res, {
            success: true,
            statusCode: 200,
            message: 'Notification deleted successfully',
            data: notification,
      });
});
const deleteAllNotifications = catchAsync(async (req: Request, res: Response) => {
      console.log(req.user);
      const notifications = await NotificationService.deleteAllNotifications(req.user.id);
      sendResponse(res, {
            success: true,
            statusCode: 200,
            message: 'All notifications deleted successfully',
            data: notifications,
      });
});

export const NotificationController = {
      getMyNotifications,
      markAllNotificationsAsRead,
      markSingleNotificationAsRead,
      deleteAllNotifications,
      deleteSingleNotification,
      createNotification,
};
