import { ObjectId } from 'mongoose';

export type ISubcategory = {
      categoryId: ObjectId;
      name: string;
      description: string;
      image: string;
      darkImage: string;
      status: 'active' | 'deleted';
};
