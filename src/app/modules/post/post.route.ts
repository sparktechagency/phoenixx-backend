import { Router } from 'express';
import { PostController } from './post.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import { PostValidation } from './post.validation';
import validateRequest from '../../middlewares/validateRequest';

const router = Router();

router.post(
      '/create-post',
      auth(USER_ROLES.USER),
      fileUploadHandler(),
      validateRequest(PostValidation.createPostZodSchema),
      PostController.createPost
);
router.post('/likes/:id', auth(USER_ROLES.USER), PostController.likePost);
router.delete('/:id', auth(USER_ROLES.USER), PostController.deletePost);

router.patch('/:id', auth(USER_ROLES.USER), fileUploadHandler(), PostController.updatePost);
router.get('/', PostController.getAllPosts);

router.get('/:id', PostController.getSinglePost);
router.get('/all-posts/my-liked-posts', auth(USER_ROLES.USER), PostController.getMyLikedPost);
router.get('/get-all-post-by-user-id/:id', PostController.getAllPostByUserId);

router.get('/all-posts/my-posts', auth(USER_ROLES.USER), PostController.getMyPosts);

export const PostRoutes = router;
