import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ContactUsService } from './contact-us.service';

const createContactUs = catchAsync(async (req: Request, res: Response) => {
      const result = await ContactUsService.createContactUsToDB(req.body);
      sendResponse(res, {
            success: true,
            statusCode: 200,
            message: 'Contact information updated successfully',
            data: result,
      });
});

const getContactUs = catchAsync(async (req: Request, res: Response) => {
      const result = await ContactUsService.getContactUsFromDB();
      sendResponse(res, {
            success: true,
            statusCode: 200,
            message: 'Contact information fetched successfully',
            data: result,
      });
});

export const ContactUsController = {
      createContactUs,
      getContactUs,
};
