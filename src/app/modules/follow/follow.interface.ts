import { ObjectId } from 'mongoose';

export interface IFollow {
      subscriber: ObjectId; 
      subscribedTo: ObjectId;
      subscribedAt: Date;
}
