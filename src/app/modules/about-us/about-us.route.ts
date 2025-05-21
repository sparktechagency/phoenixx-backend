import { Router } from 'express';
import { AboutUsController } from './about-us.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';

const router = Router();
router.post('/create-about-us', auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), AboutUsController.createAboutUs);
router.get('/', AboutUsController.getAboutUs);

export const AboutUsRoutes = router;
