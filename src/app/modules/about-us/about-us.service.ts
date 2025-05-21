import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IAboutUs } from './about-us.interface';
import { AboutUs } from './about-us.model';

const createAboutUsToDB = async (payload: IAboutUs) => {
      const result = await AboutUs.findOneAndReplace(
            {},
            { content: payload.content },
            {
                  new: true,
                  upsert: true,
            }
      );

      return result;
};

const createLogoToDB = async (files: any) => {
      let payload = {
            logo: '',
      };
      if (!files) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Image is required');
      }

      if (files && 'image' in files && files.image[0]) {
            payload.logo = `/images/${files.image[0].filename}`;
      }

      const result = await AboutUs.findOneAndReplace(
            {},
            { logo: payload.logo },
            {
                  new: true,
                  upsert: true,
            }
      );

      return result;
};

const getAboutUsFromDB = async () => {
      const result = await AboutUs.find();
      return result[0];
};

export const AboutUsService = {
      createAboutUsToDB,
      getAboutUsFromDB,
      createLogoToDB,
};
