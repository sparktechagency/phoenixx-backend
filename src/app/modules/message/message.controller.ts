import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { MessageService } from './message.service';

const sendMessage = catchAsync(async (req: Request, res: Response) => {
      const chatId = req.params.chatId;
      req.body.sender = req.user?.id;
      req.body.chatId = chatId;

      const message = await MessageService.sendMessageToDB(req.body, req.files);
      sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Send Message Successfully',
            data: message,
      });
});

const getAllMessage = catchAsync(async (req: Request, res: Response) => {
      const messages = await MessageService.getMessagesFromDB(req.params.id);
      sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Message Retrieve Successfully',
            data: messages,
      });
});
const addReaction = catchAsync(async (req: Request, res: Response) => {
      const { id } = req.user;
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
const deleteMessage = catchAsync(async (req: Request, res: Response) => {
      const { id } = req.user;
      const { messageId } = req.params;
      const messages = await MessageService.deleteMessage(id, messageId);
      sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Delete Message Successfully',
            data: messages,
      });
});

export const MessageController = { sendMessage, getAllMessage, addReaction, deleteMessage };
