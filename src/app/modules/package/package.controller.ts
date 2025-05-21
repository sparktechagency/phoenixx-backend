import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { PackageService } from './package.service';

const createPackage = catchAsync(async (req: Request, res: Response) => {
      const result = await PackageService.createPackageToDB(req.body);
      sendResponse(res, {
            success: true,
            statusCode: StatusCodes.CREATED,
            message: 'Subscription packages created successfully',
            data: result,
      });
});

const updatePackage = catchAsync(async (req: Request, res: Response) => {
      const { id } = req.params;
      const result = await PackageService.updatePackageInDB(id, req.body);
      sendResponse(res, {
            success: true,
            statusCode: StatusCodes.OK,
            message: 'Package updated successfully',
            data: result,
      });
});

// const createPackagePaymentLink = catchAsync(async (req: Request, res: Response) => {
//       const { id } = req.params;
//       const result = await PackageService.createPackageCheckoutSession(req.user?.id, id);
//       sendResponse(res, {
//             success: true,
//             statusCode: StatusCodes.OK,
//             message: 'Payment link created successfully',
//             data: result,
//       });
// });

const deletePackage = catchAsync(async (req: Request, res: Response) => {
      const { id } = req.params;
      const result = await PackageService.deletePackageFromDB(id);
      sendResponse(res, {
            success: true,
            statusCode: StatusCodes.OK,
            message: 'Package deleted successfully',
            data: result,
      });
});

const getAllPackage = catchAsync(async (req: Request, res: Response) => {
      const result = await PackageService.getAllPackageFromDB();
      sendResponse(res, {
            success: true,
            statusCode: StatusCodes.OK,
            message: 'Fetched all packages',
            data: result,
      });
});

export const PackageController = {
      createPackage,
      getAllPackage,
      updatePackage,
      deletePackage,
};
