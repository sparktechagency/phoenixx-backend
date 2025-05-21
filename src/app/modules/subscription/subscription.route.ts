import express from 'express';
import auth from '../../middlewares/auth';
import { SubscriptionController } from './subscription.controller';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

router.post('/create-subscription', auth(USER_ROLES.USER), SubscriptionController.createSubscription);
router.post('/upgrade-subscription', auth(USER_ROLES.USER), SubscriptionController.upgradeSubscription);
router.post('/cancel-subscription', auth(USER_ROLES.USER), SubscriptionController.cancelSubscription);

export const SubscriptionRoute = router;
