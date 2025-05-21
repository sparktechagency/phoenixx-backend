import { Notification } from './notification.model';
import { INotification } from './notification.interface';
import QueryBuilder from '../../../builder/QueryBuilder';

const createNotificationToDB = async (payload: Partial<INotification>) => {
      const notification = await Notification.create(payload);
      //@ts-ignore
      const io = global.io;
      if (payload.recipient && io) {
            io.emit(`notification::${payload.recipient.toString()}`, notification);
      }
      return notification;
};

const getUserNotifications = async (userId: string, query: Record<string, any>) => {
      let filter: any = { recipient: userId };
      if (query.recipientRole) {
            filter = {};
      }
      const notificationQuery = new QueryBuilder(Notification.find(filter), query)
            .search(['message'])
            .filter()
            .paginate()
            .sort()
            .fields();
      const data = await notificationQuery.modelQuery;
      const meta = await notificationQuery.countTotal();
      const unreadNotifications = await Notification.countDocuments({ recipient: userId, read: false });
      return {
            data,
            meta,
            unreadNotifications,
      };
};

const markAllNotificationsAsReadInToDB = async (userId: string) => {
      return Notification.updateMany({ recipient: userId }, { read: true });
};

const markSingleNotificationAsRead = async (notificationId: string) => {
      return Notification.findByIdAndUpdate(notificationId, { read: true }, { new: true });
};

const deleteSingleNotification = async (notificationId: string) => {
      return Notification.findByIdAndDelete(notificationId);
};
const deleteAllNotifications = async (userId: string) => {
      return Notification.deleteMany({ recipient: userId });
};

export const NotificationService = {
      createNotificationToDB,
      getUserNotifications,
      markAllNotificationsAsReadInToDB,
      markSingleNotificationAsRead,
      deleteAllNotifications,
      deleteSingleNotification,
};
