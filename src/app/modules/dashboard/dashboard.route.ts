import express from 'express';
import { DashboardController } from './dashboard.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

router.get('/stats', auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), DashboardController.getDashboardStats);
router.get('/monthly-users', auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), DashboardController.getMonthlyUsers);

export const DashboardRoutes = router;
