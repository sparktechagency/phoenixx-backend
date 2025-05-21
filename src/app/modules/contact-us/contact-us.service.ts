import { ContactUs } from './contact-us.model';
import { IContactUs } from './contact-us.interface';

const createContactUsToDB = async (payload: IContactUs) => {
      const result = await ContactUs.findOneAndUpdate({}, payload, { new: true, upsert: true });
      return result;
};

const getContactUsFromDB = async () => {
      const result = await ContactUs.find();
      return result[0];
};

export const ContactUsService = {
      createContactUsToDB,
      getContactUsFromDB,
};
