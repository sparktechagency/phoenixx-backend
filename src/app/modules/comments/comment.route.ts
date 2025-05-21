import { Router } from 'express';
import { CommentController } from './comment.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import validateRequest from '../../middlewares/validateRequest';
import { CommentValidation } from './comment.validation';

const router = Router();
router.post(
      '/create-comment',
      auth(USER_ROLES.USER),
      validateRequest(CommentValidation.createCommentZodSchema),
      CommentController.createComment
);
router.get('/my-comments', auth(USER_ROLES.USER), CommentController.getMyComments);
router.post('/likes/:id', auth(USER_ROLES.USER), CommentController.likeComment);
router.post('/replay-comments/:id', auth(USER_ROLES.USER), CommentController.replayComment);

router.patch('/:id', auth(USER_ROLES.USER), CommentController.updateComment);
router.delete('/:id', auth(USER_ROLES.USER), CommentController.deleteComment);

export const CommentRoutes = router;
