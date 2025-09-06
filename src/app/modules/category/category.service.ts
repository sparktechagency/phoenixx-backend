import QueryBuilder from '../../../builder/QueryBuilder';
import unlinkFile from '../../../shared/unlinkFile';
import { Subcategory } from '../subcategory/subcategory.model';
import { Category } from './category.model';
import { Post } from '../post/post.model';
import { ICategory } from './category.interface';
import mongoose from 'mongoose';
import slugify from 'slugify';
import ApiError from '../../../errors/ApiError';

const createUniqueSlug = async (title: string, excludeId?: string): Promise<string> => {
      let baseSlug = slugify(title, { lower: true });
      let slug = baseSlug;
      let counter = 1;

      // Build query to exclude current post (for update scenario)
      const query: any = { slug };
      if (excludeId) {
            query._id = { $ne: excludeId };
      }
      // TODO: Rakib:
      // Check if category with same slug already exists
      const existingCategory = await Category.findOne(query);
      if (existingCategory) {
            throw new ApiError(400, `${title} already exists. Please use a different.`);
      }
      //TODO: end here
      while (await Category.findOne(query)) {
            slug = `${baseSlug}-${counter}`;
            counter++;
            query.slug = slug; // Update query for next iteration
      }

      return slug;
};




const createCategoryIntoDB = async (data: ICategory, files: any) => {
         // if (data.name) {
      //       const existingCategoryWithSameName = await Category.findOne({ name: data.name });
      //       if (existingCategoryWithSameName) {
      //             throw new ApiError(400, `Category name ${data.name} already exists. Please use a different.`);
      //       }
      // }
      if (!files) {
            throw new Error('Image is required');
      }
      if (files && 'image' in files && files.image[0]) {
            data.image = `/images/${files.image[0].filename}`;
      }
      if (files && 'darkImage' in files && files.darkImage[0]) {
            data.darkImage = `/darkImages/${files.darkImage[0].filename}`;
      }
      data.slug = await createUniqueSlug(data.name);
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
      data.slug = await createUniqueSlug(data.name, id);

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

            const result = await Category.findOneAndDelete({ _id: id });
            if (!result) {
                  throw new Error('Category not found');
            }

            await Subcategory.deleteMany({ categoryId: id }, { session });

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
