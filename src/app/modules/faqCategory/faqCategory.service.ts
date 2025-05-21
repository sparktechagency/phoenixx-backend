import { FaqCategory } from './faqCategory.model';
import { IFaqCategory } from './faqCategory.interface';
import { FAQ } from '../faqs/faq.model';

const createFaqCategory = async (payload: IFaqCategory) => {
      return await FaqCategory.create(payload);
};

const getAllFaqCategories = async () => {
      return await FaqCategory.find();
};

const getFaqCategoryById = async (id: string) => {
      return await FaqCategory.findById(id);
};

const updateFaqCategory = async (id: string, payload: Partial<IFaqCategory>) => {
      return await FaqCategory.findByIdAndUpdate(id, payload, { new: true });
};

const deleteFaqCategory = async (id: string) => {
      const existingFaqCategory = await FaqCategory.findById(id);
      if (!existingFaqCategory) {
            throw new Error('FAQ Category not found');
      }
      await FAQ.deleteMany({ category: id });
      const deleteCategoryResult = await FaqCategory.findByIdAndDelete(id);

      return deleteCategoryResult;
};
export const FaqCategoryService = {
      createFaqCategory,
      getAllFaqCategories,
      getFaqCategoryById,
      updateFaqCategory,
      deleteFaqCategory,
};
