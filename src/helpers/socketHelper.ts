import colors from 'colors';
import { Server, Socket } from 'socket.io';
import { logger } from '../shared/logger';
import config from '../config';
import { jwtHelper } from './jwtHelper';
import { User } from '../app/modules/user/user.model';

interface SocketWithUser extends Socket {
      userId?: string;
}
const activeConnections = new Map<string, string>(); // userId -> socketId
const socket = (io: Server) => {
      io.on('connection', (socket: SocketWithUser) => {
            logger.info(colors.blue('A user connected'));

            // ✅ Step 1: Authentication
            socket.on('authenticate', async (token: string) => {
                  try {
                        const decoded = (await jwtHelper.verifyToken(
                              token,
                              config.jwt.jwt_access_token_secret as string
                        )) as any;
                        socket.userId = decoded.userId;

                        // Store connection
                        activeConnections.set(decoded.userId, socket.id);

                        // Set user online
                        await User.setUserOnline(decoded.userId);

                        // Broadcast to all users that this user is online
                        socket.broadcast.emit('user_online', {
                              userId: decoded.userId,
                              isOnline: true,
                              lastSeen: new Date(),
                        });

                        socket.emit('authenticated', { success: true });
                        console.log(`User ${decoded.userId} authenticated and set online`);
                  } catch (error) {
                        socket.emit('authentication_error', { message: 'Invalid token' });
                  }
            });
            // ✅ Step 2: Heartbeat system
            socket.on('heartbeat', async () => {
                  if (socket.userId) {
                        await User.updateHeartbeat(socket.userId);
                  }
            });
            // ✅ Step 3: Get online users
            socket.on('get_online_users', async () => {
                  try {
                        const onlineUsers = await User.getOnlineUsers();
                        socket.emit('online_users_list', onlineUsers);
                  } catch (error) {
                        socket.emit('error', { message: 'Failed to fetch online users' });
                  }
            });

            // ✅ Step 3: Get online users
            socket.on('get_online_users', async () => {
                  try {
                        const onlineUsers = await User.getOnlineUsers();
                        socket.emit('online_users_list', onlineUsers);
                  } catch (error) {
                        socket.emit('error', { message: 'Failed to fetch online users' });
                  }
            });
            // ✅ Step 4: Get bulk user status
            socket.on('get_users_status', async (userIds: string[]) => {
                  try {
                        const usersWithStatus = await User.bulkUserStatus(userIds);
                        socket.emit('users_status', usersWithStatus);
                  } catch (error) {
                        socket.emit('error', { message: 'Failed to fetch users status' });
                  }
            });
            // ✅ Step 5: Handle disconnect
            socket.on('disconnect', async () => {
                  if (socket.userId) {
                        // Remove from active connections
                        activeConnections.delete(socket.userId);

                        // Set user offline
                        await User.setUserOffline(socket.userId);

                        // Broadcast to all users that this user is offline
                        socket.broadcast.emit('user_offline', {
                              userId: socket.userId,
                              isOnline: false,
                              lastSeen: new Date(),
                        });

                        console.log(`User ${socket.userId} disconnected and set offline`);
                  }
            });
      });
};

export const socketHelper = { socket };
