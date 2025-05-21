import { Router } from 'express';
import { ChatController } from './chat.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';

const router = Router();
router.post('/create-chat', auth(USER_ROLES.USER), ChatController.createChat);
router.patch('/mark-chat-as-read/:id', auth(USER_ROLES.USER), ChatController.markChatAsRead);
router.get('/', auth(USER_ROLES.USER), ChatController.getChats);

export const ChatRoutes = router;
