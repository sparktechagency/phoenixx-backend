import { ObjectId } from 'mongoose';

export type IPost = {
      deletedImages?: string[];
      title: string;
      slug: string;
      categorySlug: string;
      subCategorySlug: string;
      content: string;
      images: string[];
      status: 'active' | 'deleted';
      category: ObjectId;
      subCategory: ObjectId;
      author: ObjectId;
      comments: ObjectId[];
      likes: ObjectId[];
      views: number;
};
