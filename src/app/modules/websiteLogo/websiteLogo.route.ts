import { Router } from 'express';
import { WebsiteLogoController } from './websiteLogo.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import fileUploadHandler from '../../middlewares/fileUploadHandler';

const router = Router();
router.post(
      '/upload',
      auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
      fileUploadHandler(),
      WebsiteLogoController.createOrUpdateLogo
);

router.get('/', WebsiteLogoController.getLogo);

export const WebsiteLogoRoutes = router;
