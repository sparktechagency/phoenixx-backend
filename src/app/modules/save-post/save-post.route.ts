import express from 'express';
import auth from '../../middlewares/auth';
import { SavePostController } from './save-post.controller';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

router.post('/save-or-remove', auth(USER_ROLES.USER), SavePostController.savePost);
router.get('/', auth(USER_ROLES.USER), SavePostController.getAllSavedPosts);

export const SavePostRoutes = router;
