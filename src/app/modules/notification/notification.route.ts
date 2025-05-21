import { Router } from 'express';
import { NotificationController } from './notification.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';

const router = Router();
router.post('/create-notification', NotificationController.createNotification);
router.get(
      '/',
      auth(USER_ROLES.USER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
      NotificationController.getMyNotifications
);
router.patch(
      '/mark-all-as-read',
      auth(USER_ROLES.USER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
      NotificationController.markAllNotificationsAsRead
);
router.patch(
      '/mark-single-as-read/:id',
      auth(USER_ROLES.USER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
      NotificationController.markSingleNotificationAsRead
);
router.delete(
      '/:id',
      auth(USER_ROLES.USER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
      NotificationController.deleteSingleNotification
);
router.delete(
      '/all-notifications/delete',
      auth(USER_ROLES.USER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
      NotificationController.deleteAllNotifications
);

export const NotificationRouter = router;
