import { USER_ROLES } from '../../enums/user';
import { logger } from '../../shared/logger';
import { User } from '../modules/user/user.model';
import colors from 'colors';

const superAdmin = {
      name: 'Super Admin',
      userName: 'supper_admin',
      role: USER_ROLES.SUPER_ADMIN,
      email: 'tanvirshapnil.19359@gmail.com',
      password: 'superadmin',
      profile: 'https://i.ibb.co/z5YHLV9/profile.png',
      status: 'active',
      verified: true,
};

const seedSuperAdmin = async () => {
      const isExistSuperAdmin = await User.findOne({ role: USER_ROLES.SUPER_ADMIN });
      if (!isExistSuperAdmin) {
            await User.create(superAdmin);
            logger.info(colors.yellow(`[🅰️ SEED] Super Admin user created`));
      }
};

export default seedSuperAdmin;
