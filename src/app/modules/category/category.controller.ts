import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { CategoryService } from './category.service';

const createCategory = catchAsync(async (req, res) => {
      const result = await CategoryService.createCategoryIntoDB(req.body, req.files);

      sendResponse(res, {
            success: true,
            statusCode: StatusCodes.OK,
            message: 'Category created successfully',
            data: result,
      });
});

const getAllCategories = catchAsync(async (req, res) => {
      const { result, meta } = await CategoryService.getAllCategoriesFromDB(req.query);
      sendResponse(res, {
            success: true,
            statusCode: StatusCodes.OK,
            message: 'Categories fetched successfully',
            data: {
                  meta,
                  result,
            },
      });
});

const getCategoryById = catchAsync(async (req, res) => {
      const result = await CategoryService.getCategoryByIdFromDB(req.params.id);
      sendResponse(res, {
            success: true,
            statusCode: StatusCodes.OK,
            message: 'Category fetched successfully',
            data: result,
      });
});

const updateCategory = catchAsync(async (req, res) => {
      const result = await CategoryService.updateCategoryByIdFromDB(req.params.id, req.body, req.files);
      sendResponse(res, {
            success: true,
            statusCode: StatusCodes.OK,
            message: 'Category updated successfully',
            data: result,
      });
});

const deleteCategory = catchAsync(async (req, res) => {
      const result = await CategoryService.deleteCategoryByIdFromDB(req.params.id);
      sendResponse(res, {
            success: true,
            statusCode: StatusCodes.OK,
            message: 'Category deleted successfully',
            data: result,
      });
});

export const CategoryController = {
      createCategory,
      getAllCategories,
      getCategoryById,
      updateCategory,
      deleteCategory,
};
