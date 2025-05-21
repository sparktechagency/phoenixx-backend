import { Request, Response } from 'express';
import { AboutUsService } from './about-us.service';
import sendResponse from '../../../shared/sendResponse';

const createAboutUs = async (req: Request, res: Response) => {
      const result = await AboutUsService.createAboutUsToDB(req.body);
      sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'About Us created successfully!',
            data: result,
      });
};

const getAboutUs = async (req: Request, res: Response) => {
      const result = await AboutUsService.getAboutUsFromDB();
      sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'About Us retrieved successfully!',
            data: result,
      });
};

export const AboutUsController = {
      createAboutUs,
      getAboutUs,
};
