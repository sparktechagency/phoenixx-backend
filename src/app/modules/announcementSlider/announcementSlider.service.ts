import QueryBuilder from '../../../builder/QueryBuilder';
import { IAnnouncementSlider } from './announcementSlider.interface';
import { AnnouncementSlider } from './announcementSlider.model';

const createAnnouncementSlider = async (files: any) => {
      const payload: IAnnouncementSlider = {
            image: '',
      };

      if (files && 'image' in files) {
            payload.image = `/images/${files.image[0].filename}`;
      } else {
            throw new Error('Image is required');
      }

      const result = await AnnouncementSlider.create(payload);
      if (!result) {
            throw new Error('Failed to create announcement slider');
      }
      return result;
};

const updateAnnouncementSlider = async (id: string, files: any, body: IAnnouncementSlider) => {
      const existingAnnouncementSlider = await AnnouncementSlider.findById(id);
      if (!existingAnnouncementSlider) {
            throw new Error('Announcement slider not found');
      }

      if (files && 'image' in files) {
            body.image = `/images/${files.image[0].filename}`;
      }

      const result = await AnnouncementSlider.findByIdAndUpdate(id, body, {
            new: true,
      });
      return result;
};

const deleteAnnouncementSlider = async (id: string) => {
      // Count active sliders
      const activeCount = await AnnouncementSlider.countDocuments({ status: 'active' });
      if (activeCount <= 3) {
            throw new Error('At least 3 active announcement sliders must remain.');
      }
      const result = await AnnouncementSlider.findByIdAndDelete(id);
      return result;
};

const getAllAnnouncementSliders = async (query: Record<string, unknown>) => {
      const sliders = await AnnouncementSlider.find(query);
      if (!sliders) {
            throw new Error('Failed to fetch announcement sliders');
      }
      return sliders;
};

export const AnnouncementSliderService = {
      createAnnouncementSlider,
      updateAnnouncementSlider,
      getAllAnnouncementSliders,
      deleteAnnouncementSlider,
};
