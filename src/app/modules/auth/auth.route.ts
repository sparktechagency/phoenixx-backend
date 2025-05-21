import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AuthController } from './auth.controller';
import { AuthValidation } from './auth.validation';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
const router = express.Router();

router.post('/login', validateRequest(AuthValidation.createLoginZodSchema), AuthController.loginUser);
router.post(
      '/refresh-token',
      validateRequest(AuthValidation.refreshTokenValidationSchema),
      AuthController.refreshToken
);

router.post(
      '/forget-password',
      validateRequest(AuthValidation.createForgetPasswordZodSchema),
      AuthController.forgetPassword
);

router.post('/verify-otp', validateRequest(AuthValidation.createVerifyEmailZodSchema), AuthController.verifyEmail);

router.post('/resend-otp', validateRequest(AuthValidation.resendOtpValidation), AuthController.resendOtp);

router.post(
      '/reset-password',
      
      validateRequest(AuthValidation.createResetPasswordZodSchema),
      AuthController.resetPassword
);

router.post(
      '/change-password',
      auth(USER_ROLES.ADMIN, USER_ROLES.USER, USER_ROLES.SUPER_ADMIN),
      validateRequest(AuthValidation.createChangePasswordZodSchema),
      AuthController.changePassword
);

export const AuthRoutes = router;
