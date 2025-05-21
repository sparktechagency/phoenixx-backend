import { Schema, model } from 'mongoose';
import { IContactUs } from './contact-us.interface';

const contactUsSchema = new Schema<IContactUs>({
      phone: { type: String, required: true },
      email: { type: String, required: true },
      location: { type: String, required: true },
});

export const ContactUs = model<IContactUs>('ContactUs', contactUsSchema);
