import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import validateRequest from '../../middlewares/validateRequest';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';
const router = express.Router();

router.get('/profile', auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.USER), UserController.getUserProfile);

//create a new user
router.route('/create-user').post(validateRequest(UserValidation.createUserZodSchema), UserController.createUser);
//create a new admin
router.route('/create-admin').post(
      auth(USER_ROLES.SUPER_ADMIN),
      validateRequest(UserValidation.createUserZodSchema),
      UserController.createAdmin
);

router.route('/update-status/:id').patch(
      auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
      validateRequest(UserValidation.userStatusZodSchema),
      UserController.updateStatus
);

// update user profile
router.route('/update-profile').patch(
      auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.USER),
      fileUploadHandler(),
      UserController.updateProfile
);

// get all admins
router.get('/single-user/:id', UserController.getUserById);
router.get('/get-all-users', auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN), UserController.getAllUsers);
router.route('/all-admin').get(auth(USER_ROLES.SUPER_ADMIN), UserController.getAllAdmin);
router.delete('/delete-admin/:id', auth(USER_ROLES.SUPER_ADMIN), UserController.deleteAdmin);
router.route('/delete-account').patch(auth(USER_ROLES.ADMIN, USER_ROLES.USER), UserController.deleteAccount);

//  delete user account
export const UserRoutes = router;
