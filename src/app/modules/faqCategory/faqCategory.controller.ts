import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { FaqCategoryService } from './faqCategory.service';

const createFaqCategory = catchAsync(async (req: Request, res: Response) => {
      const result = await FaqCategoryService.createFaqCategory(req.body);
      sendResponse(res, {
            success: true,
            statusCode: 201,
            message: 'FAQ Category created successfully',
            data: result,
      });
});

const getAllFaqCategories = catchAsync(async (_req: Request, res: Response) => {
      const result = await FaqCategoryService.getAllFaqCategories();
      sendResponse(res, {
            success: true,
            statusCode: 200,
            message: 'FAQ Categories fetched successfully',
            data: result,
      });
});

const getFaqCategoryById = catchAsync(async (req: Request, res: Response) => {
      const result = await FaqCategoryService.getFaqCategoryById(req.params.id);
      sendResponse(res, {
            success: true,
            statusCode: 200,
            message: 'FAQ Category fetched successfully',
            data: result,
      });
});

const updateFaqCategory = catchAsync(async (req: Request, res: Response) => {
      const result = await FaqCategoryService.updateFaqCategory(req.params.id, req.body);
      sendResponse(res, {
            success: true,
            statusCode: 200,
            message: 'FAQ Category updated successfully',
            data: result,
      });
});

const deleteFaqCategory = catchAsync(async (req: Request, res: Response) => {
      const result = await FaqCategoryService.deleteFaqCategory(req.params.id);
      sendResponse(res, {
            success: true,
            statusCode: 200,
            message: 'FAQ Category deleted successfully',
            data: result,
      });
});

export const FaqCategoryController = {
      createFaqCategory,
      getAllFaqCategories,
      getFaqCategoryById,
      updateFaqCategory,
      deleteFaqCategory,
};
