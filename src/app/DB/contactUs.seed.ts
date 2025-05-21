import { logger } from '../../shared/logger';
import { ContactUs } from '../modules/contact-us/contact-us.model';
import colors from 'colors';

const defaultContactUs = {
      phone: '+880123456789',
      email: 'info@phoenixx.com',
      location: 'Dhaka, Bangladesh',
};

const seedContactUs = async () => {
      const isExistContact = await ContactUs.findOne({});
      if (!isExistContact) {
            await ContactUs.create(defaultContactUs);
            logger.info(colors.yellow(`[🅰️ SEED] Default Contact Us info created`));
      }
};

export default seedContactUs;
