import { Router } from 'express';
import { AnnouncementSliderController } from './announcementSlider.controller';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';

const router = Router();

router.post(
      '/create',
      auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
      fileUploadHandler(),
      AnnouncementSliderController.createAnnouncementSlider
);

router.patch(
      '/:id',
      auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
      fileUploadHandler(),
      AnnouncementSliderController.updateAnnouncementSlider
);
router.get('/', AnnouncementSliderController.getAllAnnouncementSliders);
router.delete(
      '/:id',
      auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
      AnnouncementSliderController.deleteAnnouncementSlider
);
export const AnnouncementSliderRouter = router;
