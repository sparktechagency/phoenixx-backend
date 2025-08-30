import { Document } from 'mongoose';

export type ICategory = Document & {
      _id: string;
      name: string;
      slug: string;
      description?: string;
      image: string;
      darkImage: string;
      status: 'active' | 'deleted';
};
