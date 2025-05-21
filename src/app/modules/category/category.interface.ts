import { Document } from 'mongoose';

export type ICategory = Document & {
      _id: string;
      name: string;
      description?: string;
      image: string;
      status: 'active' | 'delete';
};
