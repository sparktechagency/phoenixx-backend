import { Schema, model } from 'mongoose';
import { IAnnouncementSlider } from './announcementSlider.interface';

const announcementSliderSchema = new Schema<IAnnouncementSlider>(
      {
            image: {
                  type: String,
                  required: true,
            },
            status: {
                  type: String,
                  enum: ['active', 'inactive'],
                  lowercase: true,
                  default: 'active',
            },
      },
      {
            timestamps: true,
      }
);

export const AnnouncementSlider = model<IAnnouncementSlider>('AnnouncementSlider', announcementSliderSchema);
