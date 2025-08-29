import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { ReportCommentsController } from './reportComments.controller';
import { ReportCommentsValidation } from './reportComments.validation';

const router = express.Router();

router.post('/create-report', auth(USER_ROLES.USER), ReportCommentsController.createReport);
router.patch(
      '/give-warning/:id',
      auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
      validateRequest(ReportCommentsValidation.warningReportZodSchema),
      ReportCommentsController.giveWarningReportedPostAuthor
);
router.get('/', auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), ReportCommentsController.getAllReports);
router.patch('/delete-comment/:id', auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), ReportCommentsController.deleteReportedPost);

export const ReportCommentRoutes = router;
