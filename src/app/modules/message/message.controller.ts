import { MessageService } from './message.service';
import { ChatService } from '../chat/chat.service';
import { Request } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';

const sendMessage = catchAsync(async (req, res) => {
      const { files } = req as Request & { files: any };
      const chatId: any = req.params.chatId;
      const { id } = req.user;

      if (files?.image?.length > 0) {
            req.body.images = files.image?.map((file: any) => `/images/${file.filename}`);
      }
      files?.image?.length > 0 ? req.body.type = 'image' : req.body.type = 'text';

      if (files.image?.length > 0 && req.body?.text) {
            req.body.type = 'both';
      }
      req.body.sender = id;
      req.body.chatId = chatId;
      const message = await MessageService.sendMessageToDB(req.body);
      sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Send Message Successfully',
            data: message,
      });
});
const replyToMessage = catchAsync(async (req, res) => {
      const { files } = req as Request & { files: any };
      const chatId: any = req.params.chatId;
      const { messageId } = req.params;
      const { id }: any = req.user;

      if (files?.image?.length > 0) {
            req.body.images = files.image?.map((file: any) => `/images/${file.filename}`);
      }

      req.body.sender = id;
      req.body.chatId = chatId;
      req.body.replyTo = messageId;

      const message = await MessageService.replyToMessage(req.body);
      sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Reply sent successfully',
            data: message,
      });
});
const getMessages = catchAsync(async (req, res) => {
      const { chatId } = req.params;
      const { id } = req.user;

      // Mark messages as read when user opens the chat
      await ChatService.markChatAsRead(id, chatId);

      const result = await MessageService.getMessagesFromDB(chatId, id, req.query);

      sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Messages retrieved successfully',
            data: {
                  messages: result.messages,
                  pinnedMessages: result.pinnedMessages,
            },
            pagination: {
                  limit: result.pagination.limit,
                  page: result.pagination.page,
                  total: result.pagination.total,
                  totalPage: result.pagination.totalPage,
            },
      });
});

const addReaction = catchAsync(async (req, res) => {
      const { id }: any = req.user;
      const { messageId } = req.params;
      const { reactionType } = req.body;
      const messages = await MessageService.addReactionToMessage(id, messageId, reactionType);
      sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Reaction Added Successfully',
            data: messages,
      });
});

const deleteMessage = catchAsync(async (req, res) => {
      const { id }: any = req.user;
      const { messageId } = req.params;
      const messages = await MessageService.deleteMessage(id, messageId);
      sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Message Deleted Successfully',
            data: messages,
      });
});

// New controller: Pin/Unpin message
const pinUnpinMessage = catchAsync(async (req, res) => {
      const { id }: any = req.user;
      const { messageId } = req.params;
      const { action } = req.body; // 'pin' or 'unpin'

      const result = await MessageService.pinUnpinMessage(id, messageId, action);
      sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: `Message ${action}ned successfully`,
            data: result,
      });
});

export const MessageController = {
      sendMessage,
      getMessages,
      addReaction,
      deleteMessage,
      pinUnpinMessage,
      replyToMessage,
};
