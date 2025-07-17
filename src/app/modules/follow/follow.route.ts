import express from 'express';
import { FollowController } from './follow.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
const router = express.Router();
// Subscribe to a user
router.post('/subscribe', auth(USER_ROLES.USER), FollowController.subscribe);
// Unsubscribe from a user
router.post('/unsubscribe', auth(USER_ROLES.USER), FollowController.unsubscribe);
// Get all subscriptions of a user
router.get('/subscriptions/:userId', auth(USER_ROLES.USER), FollowController.getSubscriptions);
export const FollowRoute = router;
