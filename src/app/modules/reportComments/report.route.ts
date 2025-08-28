import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { ReportController } from './report.controller';
import { ReportValidation } from './report.validation';

const router = express.Router();

router.post('/create-report', auth(USER_ROLES.USER), ReportController.createReport);
router.patch(
      '/give-warning/:id',
      auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
      validateRequest(ReportValidation.warningReportZodSchema),
      ReportController.giveWarningReportedPostAuthor
);
router.get('/', auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), ReportController.getAllReports);
router.patch('/delete-post/:id', auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), ReportController.deleteReportedPost);

export const ReportRoutes = router;
