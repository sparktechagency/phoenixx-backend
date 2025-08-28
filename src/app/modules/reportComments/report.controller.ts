import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ReportService } from './report.service';
import { StatusCodes } from 'http-status-codes';

const createReport = catchAsync(async (req: Request, res: Response) => {
      req.body.reporterId = req.user?.id;
      const result = await ReportService.createReport(req.body);

      sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Report created successfully',
            data: result,
      });
});

const getAllReports = catchAsync(async (req: Request, res: Response) => {
      const result = await ReportService.getAllReports(req.query);

      sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Reports retrieved successfully',
            data: result,
      });
});

const giveWarningReportedPostAuthor = catchAsync(async (req: Request, res: Response) => {
      const { id } = req.params;
      const result = await ReportService.giveWarningReportedPostAuthorToDB(id, req.body.message);

      sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Report status updated successfully',
            data: result,
      });
});

const deleteReportedPost = catchAsync(async (req: Request, res: Response) => {
      const { id } = req.params;
      const result = await ReportService.deleteReportedPost(id);

      sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Report status updated successfully',
            data: result,
      });
});

export const ReportController = {
      createReport,
      getAllReports,
      deleteReportedPost,
      giveWarningReportedPostAuthor,
};
