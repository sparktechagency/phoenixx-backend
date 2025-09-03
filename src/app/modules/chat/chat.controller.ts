
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ChatService } from './chat.service';
import { User } from '../user/user.model';

const createChat = catchAsync(async (req, res) => {
  const participantId = await User.findOne({userName: req.body.participant});
  if (!participantId) {
    throw new Error('Participant not found');
  }
  const { id }: any = req.user;
  const participants = [id, participantId._id];
  const result = await ChatService.createChatIntoDB(participants);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Chat created successfully',
    data: result,
  });
});

const markChatAsRead = catchAsync(async (req, res) => {
  const { id } = req.params;
  const user: any = req?.user;

  const result = await ChatService.markChatAsRead(user.id, id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Chat marked as read',
    data: result,
  });
});
const markMessagesAsIconViewed  = catchAsync(async (req, res) => {
  const user: any = req?.user;
  const result = await ChatService.markMessagesAsIconViewed(user.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Chat marked as read',
    data: result,
  });
});

const getChats = catchAsync(async (req, res) => {
  const { id } = req.user;
  const result = await ChatService.getAllChatsFromDB(id, req.query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Chats retrieved successfully',
    data: {
      chats: result.data,
      // Include chat statistics in data instead of meta
      unreadChatsCount: result.unreadChatsCount,
      totalUnreadMessages: result.totalUnreadMessages,
      totalIconUnreadMessages: result.totalIconUnreadMessages,
    },
    pagination: result.meta, // Standard pagination meta
  });
});

const deleteChat = catchAsync(async (req, res) => {
  const { id } = req.user;
  const { chatId } = req.params;
  const result = await ChatService.softDeleteChatForUser(chatId, id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Chat deleted successfully',
    data: result,
  });
});

// New controller: Mute/Unmute chat
const muteUnmuteChat = catchAsync(async (req, res) => {
  const { id } = req.user;
  const { chatId } = req.params;
  const { action } = req.body; // 'mute' or 'unmute'

  const result = await ChatService.muteUnmuteChat(id, chatId, action);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: `Chat ${action}d successfully`,
    data: result,
  });
});

// New controller: Block/Unblock user
const blockUnblockUser = catchAsync(async (req, res) => {
  const { id } = req.user;
  const { chatId, targetUserId } = req.params;
  const { action } = req.body; // 'block' or 'unblock'

  const result = await ChatService.blockUnblockUser(
    id,
    targetUserId,
    chatId,
    action,
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: `User ${action}ed successfully`,
    data: result,
  });
});

export const ChatController = {
  createChat,
  getChats,
  markChatAsRead,
  deleteChat,
  muteUnmuteChat,
  blockUnblockUser,
  markMessagesAsIconViewed
};
