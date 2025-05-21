import express from 'express';
import auth from '../../middlewares/auth';
import { PackageController } from './package.controller';
import { USER_ROLES } from '../../../enums/user';
import validateRequest from '../../middlewares/validateRequest';
import { PackageValidation } from './package.validation';

const router = express.Router();

router.post(
      '/create-package',
      auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
      validateRequest(PackageValidation.createPackageZodSchema),
      PackageController.createPackage
);
router.patch('/:id', auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), PackageController.updatePackage);
router.get('/', PackageController.getAllPackage);
router.delete('/:id', auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), PackageController.deletePackage);
export const PackageRoutes = router;
