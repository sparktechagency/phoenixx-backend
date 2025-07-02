import express from 'express';
import { MessageController } from './message.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import fileUploadHandler from '../../middlewares/fileUploadHandler';

const router = express.Router();

// Existing routes
router.post(
  '/send-message/:chatId',
  fileUploadHandler(),
  auth(
    USER_ROLES.USER,
    USER_ROLES.SUPER_ADMIN,
    USER_ROLES.ADMIN,
  ),
  MessageController.sendMessage,
);
// Reply to a message
router.post(
  '/:chatId/reply/:messageId',
  fileUploadHandler(),
  auth(USER_ROLES.USER),
  MessageController.replyToMessage,
);
router.get(
  '/:chatId',
  auth(
     USER_ROLES.USER,
     USER_ROLES.SUPER_ADMIN,
     USER_ROLES.ADMIN,
   ),
  MessageController.getMessages,
);

router.post(
  '/react/:messageId',
  auth(
     USER_ROLES.USER,
     USER_ROLES.SUPER_ADMIN,
     USER_ROLES.ADMIN,
   ),
  MessageController.addReaction,
);

router.delete(
  '/delete/:messageId',
  auth(
     USER_ROLES.USER,
     USER_ROLES.SUPER_ADMIN,
     USER_ROLES.ADMIN,
   ),
  MessageController.deleteMessage,
);

// New route for pin/unpin message
router.patch(
  '/pin-unpin/:messageId',
  auth(
     USER_ROLES.USER,
     USER_ROLES.SUPER_ADMIN,
     USER_ROLES.ADMIN,
   ),
  MessageController.pinUnpinMessage,
);

export const MessageRoutes = router;