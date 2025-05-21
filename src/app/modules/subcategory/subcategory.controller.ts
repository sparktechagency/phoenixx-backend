import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { SubcategoryService } from './subcategory.service';

const createSubcategory = catchAsync(async (req, res) => {
      const result = await SubcategoryService.createSubcategoryIntoDB(req.body, req.files);
      sendResponse(res, {
            success: true,
            statusCode: StatusCodes.OK,
            message: 'Subcategory created successfully',
            data: result,
      });
});

const getAllSubcategories = catchAsync(async (req, res) => {
      const result = await SubcategoryService.getAllSubcategoriesFromDB(req.query);
      sendResponse(res, {
            success: true,
            statusCode: StatusCodes.OK,
            message: 'Subcategories retrieved successfully',
            data: result,
      });
});

const getSubCategoriesByCategoryId = catchAsync(async (req, res) => {
      const result = await SubcategoryService.getSubcategoriesByCategoryIdFromDB(req.params.id);
      sendResponse(res, {
            success: true,
            statusCode: StatusCodes.OK,
            message: 'Subcategories retrieved successfully',
            data: result,
      });
});

const getSubcategoryById = catchAsync(async (req, res) => {
      const result = await SubcategoryService.getSubcategoryByIdFromDB(req.params.id);
      sendResponse(res, {
            success: true,
            statusCode: StatusCodes.OK,
            message: 'Subcategory fetched successfully',
            data: result,
      });
});

const updateSubcategory = catchAsync(async (req, res) => {
      const result = await SubcategoryService.updateSubcategoryByIdFromDB(req.params.id, req.body, req.files);
      sendResponse(res, {
            success: true,
            statusCode: StatusCodes.OK,
            message: 'Subcategory updated successfully',
            data: result,
      });
});

const deleteSubcategory = catchAsync(async (req, res) => {
      const result = await SubcategoryService.deleteSubcategoryByIdFromDB(req.params.id);
      sendResponse(res, {
            success: true,
            statusCode: StatusCodes.OK,
            message: 'Subcategory deleted successfully',
            data: result,
      });
});

export const SubcategoryController = {
      createSubcategory,
      getAllSubcategories,
      getSubcategoryById,
      updateSubcategory,
      deleteSubcategory,
      getSubCategoriesByCategoryId,
};
