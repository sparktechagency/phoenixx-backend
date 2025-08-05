import { User } from "../app/modules/user/user.model";

export const cleanupInactiveUsers = async () => {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  
  try {
    const inactiveUsers = await User.find({
      'onlineStatus.isOnline': true,
      'onlineStatus.lastHeartbeat': { $lt: fiveMinutesAgo }
    });

    for (const user of inactiveUsers) {
      await User.setUserOffline(user._id.toString());
      
      // If you have access to io instance, broadcast offline status
      // io.emit('user_offline', {
      //   userId: user._id.toString(),
      //   isOnline: false,
      //   lastSeen: new Date(),
      // });
    }
    console.log(`Cleaned up ${inactiveUsers.length} inactive users`);
  } catch (error) {
    console.error('Cleanup job failed:', error);
  }
};