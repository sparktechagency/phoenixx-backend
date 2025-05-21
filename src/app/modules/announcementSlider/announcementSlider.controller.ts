import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { AnnouncementSliderService } from './announcementSlider.service';

const createAnnouncementSlider = catchAsync(async (req: Request, res: Response) => {
      const result = await AnnouncementSliderService.createAnnouncementSlider(req.files as Express.Multer.File[]);
      sendResponse(res, {
            success: true,
            statusCode: 201,
            message: 'Announcement slider created successfully',
            data: result,
      });
});

const updateAnnouncementSlider = catchAsync(async (req: Request, res: Response) => {
      const { id } = req.params;
      const result = await AnnouncementSliderService.updateAnnouncementSlider(
            id,
            req.files as Express.Multer.File[],
            req.body
      );
      sendResponse(res, {
            success: true,
            statusCode: 200,
            message: 'Announcement slider updated successfully',
            data: result,
      });
});

const deleteAnnouncementSlider = catchAsync(async (req: Request, res: Response) => {
      const { id } = req.params;
      const result = await AnnouncementSliderService.deleteAnnouncementSlider(id);
      sendResponse(res, {
            success: true,
            statusCode: 200,
            message: 'Announcement slider deleted successfully',
            data: result,
      });
});

const getAllAnnouncementSliders = catchAsync(async (req: Request, res: Response) => {
      const result = await AnnouncementSliderService.getAllAnnouncementSliders(req.query);
      sendResponse(res, {
            success: true,
            statusCode: 200,
            message: 'Announcement sliders fetched successfully',
            data: result,
      });
});

export const AnnouncementSliderController = {
      createAnnouncementSlider,
      getAllAnnouncementSliders,
      updateAnnouncementSlider,
      deleteAnnouncementSlider,
};
