import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { Chat } from '../chat/chat.model';
import { IMessage } from './message.interface';
import { Message } from './message.model';

import { Types } from 'mongoose';

// Enhanced version with better error handling and logging
const sendMessageToDB = async (payload: IMessage): Promise<IMessage> => {
      // Check if chat exists
      const chat = await Chat.findById(payload.chatId);
      if (!chat) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Chat not found');
      }

      // Verify sender is participant
      const isSenderParticipant = chat.participants.some((p) => p.toString() === payload.sender.toString());

      if (!isSenderParticipant) {
            throw new ApiError(StatusCodes.FORBIDDEN, 'Sender is not a participant in this chat');
      }

      // Check if sender is blocked
      const isBlocked = chat.blockedUsers?.some(
            (block: any) =>
                  (block.blocker.toString() === payload.sender.toString() &&
                        chat.participants.some((p) => p.toString() === block.blocked.toString())) ||
                  (block.blocked.toString() === payload.sender.toString() &&
                        chat.participants.some((p) => p.toString() === block.blocker.toString()))
      );

      if (isBlocked) {
            throw new ApiError(StatusCodes.FORBIDDEN, 'Cannot send message to blocked user');
      }

      // Create message with proper defaults
      const messagePayload = {
            ...payload,
            read: false, // Always false for new messages
            readAt: null,
            isDeleted: false,
            createdAt: new Date(),
      };

      const response = await Message.create(messagePayload);

      // Update chat - remove ALL participants from readBy except sender
      // This ensures unread count is calculated correctly
      await Chat.findByIdAndUpdate(
            response?.chatId,
            {
                  lastMessage: response._id,
                  readBy: [payload.sender.toString()], // Only sender has read it
                  updatedAt: new Date(),
            },
            { new: true }
      );

      // Get populated message for socket
      const populatedMessage = await Message.findById(response._id)
            .populate('sender', 'userName name email profile')
            .lean();

      // Get updated chat with populated data for chat list update
      const populatedChat = await Chat.findById(response?.chatId)
            .populate('participants', 'userName name email profile')
            .populate('lastMessage')
            .lean();

      // Socket emissions
      //@ts-ignore
      const io = global.io;

      if (chat.participants && io) {
            const otherParticipants = chat.participants.filter(
                  (participant) => participant && participant.toString() !== payload.sender.toString()
            );

            // Emit to each participant
            otherParticipants.forEach((participantId) => {
                  const participantIdStr = participantId.toString();

                  // Emit new message
                  io.emit(`newMessage::${participantIdStr}`, populatedMessage);

                  // Emit unread count update - let frontend handle the increment
                  io.emit(`unreadCountUpdate::${participantIdStr}`, {
                        chatId: payload.chatId,
                        action: 'increment', // Frontend should increment its local count
                  });

                  // Emit chat list update to move this chat to top
                  io.emit(`chatListUpdate::${participantIdStr}`, {
                        chatId: payload.chatId,
                        chat: populatedChat,
                        action: 'moveToTop',
                        lastMessage: populatedMessage,
                        updatedAt: new Date(),
                  });
            });

            // Also emit chat list update to sender (to update their own chat list)
            const senderIdStr = payload.sender.toString();
            io.emit(`chatListUpdate::${senderIdStr}`, {
                  chatId: payload.chatId,
                  chat: populatedChat,
                  action: 'moveToTop',
                  lastMessage: populatedMessage,
                  updatedAt: new Date(),
            });
      }

      return response;
};

const getMessagesFromDB = async (
      chatId: string,
      userId: string, // Add userId parameter
      query: Record<string, unknown>
): Promise<{
      messages: IMessage[];
      pinnedMessages: IMessage[];
}> => {
      const response = await Message.find({ chatId })
            .populate({
                  path: 'sender',
                  select: 'userName name email profile',
            })
            .populate({ path: 'reactions.userId', select: 'userName name' })
            .populate({ path: 'pinnedBy', select: 'userName name' })
            .sort({ createdAt: -1 });

      // Mark messages as read for the current user (only messages not sent by current user)
      const messageIds = response
            .filter((msg) => msg.sender._id.toString() !== userId && !msg.read)
            .map((msg) => msg._id);

      if (messageIds.length > 0) {
            await Message.updateMany(
                  {
                        _id: { $in: messageIds },
                        sender: { $ne: userId }, // Only update messages not sent by current user
                  },
                  {
                        $set: { read: true, readAt: new Date() },
                  }
            );
      }

      // Get pinned messages separately
      const pinnedMessages = await Message.find({
            chatId,
            isPinned: true,
            isDeleted: false,
      })
            .populate({
                  path: 'sender',
                  select: 'userName name email profile',
            })
            .populate({ path: 'pinnedBy', select: 'userName name' })
            .sort({ pinnedAt: -1 });

      const formattedMessages = response.map((message) => ({
            ...message.toObject(),
            isDeleted: message.isDeleted,
            text: message.isDeleted ? 'This message has been deleted.' : message.text,
      }));

      const formattedPinnedMessages = pinnedMessages.map((message) => ({
            ...message.toObject(),
            text: message.isDeleted ? 'This message has been deleted.' : message.text,
      }));

      return {
            messages: formattedMessages,
            pinnedMessages: formattedPinnedMessages,
      };
};

const addReactionToMessage = async (
      id: string,
      messageId: string,
      reactionType: 'like' | 'love' | 'thumbs_up' | 'laugh' | 'angry' | 'sad'
) => {
      const userId = new Types.ObjectId(id);
      // Validate the reaction type
      const validReactions = ['like', 'love', 'thumbs_up', 'laugh', 'angry', 'sad'];
      if (!validReactions.includes(reactionType)) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid reaction type');
      }

      try {
            // Find the message by ID
            const message = await Message.findById(messageId);
            if (!message) {
                  throw new ApiError(StatusCodes.NOT_FOUND, 'Message not found');
            }

            // Check if users are blocked
            const chat = await Chat.findById(message.chatId);
            if (chat) {
                  const isBlocked = chat.blockedUsers?.some(
                        (block: any) =>
                              (block.blocker.toString() === userId.toString() &&
                                    block.blocked.toString() === message.sender.toString()) ||
                              (block.blocked.toString() === userId.toString() &&
                                    block.blocker.toString() === message.sender.toString())
                  );

                  if (isBlocked) {
                        throw new ApiError(StatusCodes.FORBIDDEN, 'Cannot react to messages from blocked users');
                  }
            }

            // Check if the user has already reacted to the message
            const existingReaction = message.reactions.find(
                  (reaction) => reaction.userId.toString() === userId.toString()
            );

            if (existingReaction) {
                  // Update the existing reaction
                  existingReaction.reactionType = reactionType;
                  existingReaction.timestamp = new Date();
            } else {
                  // Add a new reaction
                  message.reactions.push({ userId, reactionType, timestamp: new Date() });
            }

            // Save the updated message
            const updatedMessage = await message.save();

            return updatedMessage;
      } catch (error) {
            console.error('Error updating reaction:', error);
            throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Internal server error!');
      }
};

const deleteMessage = async (userId: string, messageId: string) => {
      try {
            // Find the message by messageId
            const message = await Message.findById(messageId);
            if (!message) {
                  throw new ApiError(StatusCodes.NOT_FOUND, 'Message not found');
            }

            // Ensure the user is the sender of the message
            if (message.sender.toString() !== userId.toString()) {
                  throw new ApiError(StatusCodes.FORBIDDEN, 'You can only delete your own messages');
            }

            const updateMessage = await Message.findByIdAndUpdate(
                  message._id,
                  {
                        $set: {
                              isDeleted: true,
                              isPinned: false, // Unpin message when deleted
                              pinnedBy: undefined,
                              pinnedAt: undefined,
                        },
                  },
                  { new: true }
            );

            // If message was pinned, also remove from chat's pinnedMessages
            if (message.isPinned) {
                  await Chat.findByIdAndUpdate(message.chatId, {
                        $pull: { pinnedMessages: messageId },
                  });
            }

            return updateMessage;
      } catch (error) {
            console.error('Error deleting message:', error);
            throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Internal server error');
      }
};

// New feature: Pin/Unpin message
const pinUnpinMessage = async (userId: string, messageId: string, action: 'pin' | 'unpin') => {
      try {
            const message = await Message.findById(messageId);
            if (!message) {
                  throw new ApiError(StatusCodes.NOT_FOUND, 'Message not found');
            }

            // Check if user is participant in the chat
            const chat = await Chat.findById(message.chatId);
            if (!chat || !chat.participants.some((p) => p.toString() === userId)) {
                  throw new ApiError(StatusCodes.FORBIDDEN, 'You are not authorized to pin messages in this chat');
            }

            // Check if users are blocked
            const isBlocked = chat.blockedUsers?.some(
                  (block: any) =>
                        (block.blocker.toString() === userId &&
                              block.blocked.toString() === message.sender.toString()) ||
                        (block.blocked.toString() === userId && block.blocker.toString() === message.sender.toString())
            );

            if (isBlocked) {
                  throw new ApiError(StatusCodes.FORBIDDEN, 'Cannot pin messages from blocked users');
            }

            if (action === 'pin') {
                  // Check if message is already pinned
                  if (message.isPinned) {
                        throw new ApiError(StatusCodes.BAD_REQUEST, 'Message is already pinned');
                  }

                  // Check pinned messages limit (optional - limit to 10 pinned messages per chat)
                  const pinnedCount = await Message.countDocuments({
                        chatId: message.chatId,
                        isPinned: true,
                        isDeleted: false,
                  });

                  if (pinnedCount >= 10) {
                        throw new ApiError(StatusCodes.BAD_REQUEST, 'Maximum 10 messages can be pinned per chat');
                  }

                  // Pin the message
                  const updatedMessage = await Message.findByIdAndUpdate(
                        messageId,
                        {
                              $set: {
                                    isPinned: true,
                                    pinnedBy: userId,
                                    pinnedAt: new Date(),
                              },
                        },
                        { new: true }
                  );

                  // Add to chat's pinnedMessages array
                  await Chat.findByIdAndUpdate(message.chatId, {
                        $addToSet: { pinnedMessages: messageId },
                  });

                  //@ts-ignore
                  const io = global.io;
                  // Notify all participants
                  chat.participants.forEach((participantId) => {
                        //@ts-ignore
                        io.emit(`messagePinned::${participantId}`, {
                              messageId,
                              chatId: message.chatId,
                              pinnedBy: userId,
                              message: updatedMessage,
                        });
                  });

                  return updatedMessage;
            } else {
                  // Unpin the message
                  if (!message.isPinned) {
                        throw new ApiError(StatusCodes.BAD_REQUEST, 'Message is not pinned');
                  }

                  const updatedMessage = await Message.findByIdAndUpdate(
                        messageId,
                        {
                              $set: {
                                    isPinned: false,
                                    pinnedBy: undefined,
                                    pinnedAt: undefined,
                              },
                        },
                        { new: true }
                  );

                  // Remove from chat's pinnedMessages array
                  await Chat.findByIdAndUpdate(message.chatId, {
                        $pull: { pinnedMessages: messageId },
                  });

                  //@ts-ignore
                  const io = global.io;
                  // Notify all participants
                  chat.participants.forEach((participantId) => {
                        //@ts-ignore
                        io.emit(`messageUnpinned::${participantId}`, {
                              messageId,
                              chatId: message.chatId,
                              unpinnedBy: userId,
                        });
                  });

                  return updatedMessage;
            }
      } catch (error) {
            console.error('Error pinning/unpinning message:', error);
            throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Internal server error');
      }
};
const replyToMessage = async (payload: Partial<IMessage>) => {
      // First check if the original message exists
      const originalMessage = await Message.findById(payload.replyTo);
      if (!originalMessage) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Original message not found');
      }

      if (originalMessage.isDeleted) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Cannot reply to a deleted message');
      }

      // Check if chat exists and user is a member
      const chat = await Chat.findById(payload.chatId);
      if (!chat) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Chat not found');
      }

      if (!chat.participants.includes(payload.sender as any)) {
            throw new ApiError(StatusCodes.FORBIDDEN, 'You are not a member of this chat');
      }

      // Set reply information
      payload.replyText = originalMessage.text;
      payload.replySender = originalMessage.sender;
      payload.replyType = originalMessage.type;

      const message = await Message.create(payload);

      // Update chat's last message
      await Chat.findByIdAndUpdate(payload.chatId, {
            lastMessage: message._id,
            lastActivity: new Date(),
      });

      return await Message.findById(message._id)
            .populate('sender', 'name profileImage')
            .populate('replyTo')
            .populate('replySender', 'name profileImage');
};

export const MessageService = {
      sendMessageToDB,
      getMessagesFromDB,
      addReactionToMessage,
      deleteMessage,
      pinUnpinMessage,
      replyToMessage,
};
