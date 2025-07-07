import QueryBuilder from '../../../builder/QueryBuilder';
import unlinkFile from '../../../shared/unlinkFile';
import { Subcategory } from '../subcategory/subcategory.model';
import { Category } from './category.model';
import { Post } from '../post/post.model';
import { ICategory } from './category.interface';
import mongoose from 'mongoose';

const createCategoryIntoDB = async (data: ICategory, files: any) => {
      if (!files) {
            throw new Error('Image is required');
      }
      if (files && 'image' in files && files.image[0]) {
            data.image = `/images/${files.image[0].filename}`;
      }
      if (files && 'darkImage' in files && files.darkImage[0]) {
            data.darkImage = `/darkImages/${files.darkImage[0].filename}`;
      }
      const result = await Category.create(data);
      if (!result) {
            throw new Error('Failed to create category');
      }
      return result;
};

const getAllCategoriesFromDB = async (query: any) => {
      try {
            const categories = new QueryBuilder(Category.find({ status: 'active' }), query)
                  .search(['name'])
                  .filter()
                  .paginate()
                  .sort()
                  .fields();

            const categoriesResult = await categories.modelQuery;
            const meta = await categories.countTotal();
            if (!categoriesResult) {
                  throw new Error('Failed to fetch categories');
            }

            const result = await Promise.all(
                  categoriesResult.map(async (category) => {
                        const subcategories = await Subcategory.find({ categoryId: category._id, status: 'active' });

                        // Get post count for category
                        const categoryPostCount = await Post.countDocuments({
                              category: category._id,
                              status: 'active',
                        });

                        // Get post counts for each subcategory
                        const subcategoriesWithCounts = await Promise.all(
                              subcategories.map(async (subcategory) => {
                                    const postCount = await Post.countDocuments({
                                          subCategory: subcategory._id,
                                          status: 'active',
                                    });

                                    return {
                                          ...subcategory.toObject(),
                                          postCount,
                                    };
                              })
                        );

                        return {
                              category: {
                                    ...category.toObject(),
                                    postCount: categoryPostCount,
                              },
                              subcategories: subcategoriesWithCounts,
                        };
                  })
            );

            return {
                  result,
                  meta,
            };
      } catch (error) {
            console.error('Error fetching categories:', error);
            throw new Error('Failed to fetch categories');
      }
};

const getCategoryByIdFromDB = async (id: string) => {
      const result = await Category.findById(id);
      if (!result) {
            throw new Error('Category not found');
      }
      return result;
};

const updateCategoryByIdFromDB = async (id: string, data: ICategory, files: any) => {
      const existingCategory = await Category.findById(id);

      if (!existingCategory) {
            throw new Error('Category not found');
      }

      if (files && 'image' in files && files.image[0]) {
            data.image = `/images/${files.image[0].filename}`;
            unlinkFile(existingCategory.image);
      }
      if (files && 'darkImage' in files && files.darkImage[0]) {
            data.darkImage = `/darkImages/${files.darkImage[0].filename}`;
            unlinkFile(existingCategory.darkImage);
      }
      

      const result = await Category.findOneAndUpdate({ _id: id }, data, { new: true, upsert: true });
      if (!result) {
            throw new Error('Category not found');
      }
      return result;
};

const deleteCategoryByIdFromDB = async (id: string) => {
      const session = await mongoose.startSession();
      try {
            session.startTransaction();

            const result = await Category.findOneAndUpdate({ _id: id }, { status: 'deleted' }, { new: true, session });
            if (!result) {
                  throw new Error('Category not found');
            }

            await Subcategory.updateMany({ categoryId: id }, { status: 'deleted' }, { session });

            await session.commitTransaction();
            return result;
      } catch (error) {
            await session.abortTransaction();
            throw error;
      } finally {
            session.endSession();
      }
};

export const CategoryService = {
      createCategoryIntoDB,
      getAllCategoriesFromDB,
      getCategoryByIdFromDB,
      updateCategoryByIdFromDB,
      deleteCategoryByIdFromDB,
};
