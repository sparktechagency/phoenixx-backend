import QueryBuilder from '../../../builder/QueryBuilder';
import unlinkFile from '../../../shared/unlinkFile';
import { ISubcategory } from './subcategory.interface';
import { Subcategory } from './subcategory.model';

const createSubcategoryIntoDB = async (data: ISubcategory, files: any) => {
      if (files && 'image' in files && files.image[0]) {
            data.image = `/images/${files.image[0].filename}`;
      }
      const result = await Subcategory.create(data);
      if (!result) {
            throw new Error('Failed to create subcategory');
      }
      return result;
};

const getAllSubcategoriesFromDB = async (query: any) => {
      const subcategoryQuery = new QueryBuilder(Subcategory.find(), query)
            .search(['name'])
            .filter()
            .paginate()
            .sort()
            .fields();
      const meta = await subcategoryQuery.countTotal();
      const result = await subcategoryQuery.modelQuery;

      if (!result) {
            throw new Error('Failed to get subcategories');
      }
      return { result, meta };
};

const getSubcategoriesByCategoryIdFromDB = async (categoryId: string) => {
      const subcategories = await Subcategory.find({ categoryId, status: 'active' });
      if (!subcategories) {
            throw new Error('Subcategories not found');
      }
      return subcategories;
};

const getSubcategoryByIdFromDB = async (id: string) => {
      const result = await Subcategory.findById(id);
      if (!result) {
            throw new Error('Subcategory not found');
      }
      return result;
};

const updateSubcategoryByIdFromDB = async (id: string, data: ISubcategory, files: any) => {
      const existingSubcategory = await Subcategory.findById(id);

      if (!existingSubcategory) {
            throw new Error('Subcategory not found');
      }

      if (files && 'image' in files && files.image[0]) {
            data.image = `/images/${files.image[0].filename}`;
            unlinkFile(existingSubcategory.image);
      }

      const result = await Subcategory.findOneAndUpdate({ _id: id }, data, { new: true, upsert: true });
      if (!result) {
            throw new Error('Subcategory not found');
      }
      return result;
};

const deleteSubcategoryByIdFromDB = async (id: string) => {
      const result = await Subcategory.findOneAndUpdate(
            { _id: id },
            { status: 'deleted' },
            { new: true, upsert: true }
      );
      if (!result) {
            throw new Error('Subcategory not found');
      }
      return result;
};

export const SubcategoryService = {
      createSubcategoryIntoDB,
      getAllSubcategoriesFromDB,
      getSubcategoryByIdFromDB,
      updateSubcategoryByIdFromDB,
      deleteSubcategoryByIdFromDB,
      getSubcategoriesByCategoryIdFromDB,
};
