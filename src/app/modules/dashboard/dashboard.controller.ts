import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { DashboardService } from './dashboard.service';
import sendResponse from '../../../shared/sendResponse';

const getDashboardStats = catchAsync(async (req: Request, res: Response) => {
      const stats = await DashboardService.getDashboardStats();
      sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Dashboard stats fetched successfully',
            data: stats,
      });
});

const getMonthlyUsers = catchAsync(async (req: Request, res: Response) => {
      const stats = await DashboardService.getMonthlyUsers(req.query.year as string);
      sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Monthly users fetched successfully',
            data: stats,
      });
});

export const DashboardController = {
      getDashboardStats,
      getMonthlyUsers,
};
