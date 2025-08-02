import { Router } from 'express';
import { FeedbackController } from './feedback.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import validateRequest from '../../middlewares/validateRequest';
import { FeedbackValidation } from './feedback.validation';

const router = Router();
router.post(
      '/create-feedback',
      auth(USER_ROLES.USER),
      validateRequest(FeedbackValidation.createFeedbackZodSchema),
      FeedbackController.createFeedback
);
router.get('/', auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), FeedbackController.getAllFeedbacks);
router.delete('/:feedbackId', auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), FeedbackController.deleteFeedback);

export const FeedbackRoutes = router;
