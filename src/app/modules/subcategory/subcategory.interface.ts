import { ObjectId } from 'mongoose';

export type ISubcategory = {
      categoryId: ObjectId;
      name: string;
      description: string;
      image: string;
      status: 'active' | 'deleted';
};
