import express, { NextFunction, Request, Response } from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { MessageController } from './message.controller';
import fileUploadHandler from '../../middlewares/fileUploadHandler';

const router = express.Router();

router.post('/send-message/:chatId', auth(USER_ROLES.USER), fileUploadHandler(), MessageController.sendMessage);
router.get('/:id', auth(USER_ROLES.USER), MessageController.getAllMessage);
router.post('/react/:messageId', auth(USER_ROLES.USER), MessageController.addReaction);
router.delete('/delete/:messageId', auth(USER_ROLES.USER), MessageController.deleteMessage);

export const MessageRoutes = router;
