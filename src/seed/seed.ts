import mongoose from 'mongoose';
import colors from 'colors';
import bcrypt from 'bcrypt';
import config from '../config';
import { USER_ROLES } from '../enums/user';
import { User } from '../app/modules/user/user.model';
import { logger } from '../shared/logger';


const usersData = [
      {
            name: config.super_admin_name,
            userName: config.super_admin_name,
            email: config.super_admin_email,
            role: USER_ROLES.SUPER_ADMIN,
            password: config.super_admin_password,
            profile: 'https://i.ibb.co/z5YHLV9/profile.png',
            status: 'active',
            verified: true,
      },
];

// Function to hash passwords
const hashPassword = async (password: string) => {
      const salt = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds));
      return await bcrypt.hash(password, salt);
};

// Function to seed users
const seedUsers = async () => {
      try {
            await User.deleteMany();

            const hashedUsersData = await Promise.all(
                  usersData.map(async (user: any) => {
                        const hashedPassword = await hashPassword(user.password);
                        return { ...user, password: hashedPassword };
                  })
            );

            // Insert users into the database
            await User.insertMany(hashedUsersData);
            logger.info(colors.green('✨ --------------> Users seeded successfully <-------------- ✨'));
      } catch (err) {
            logger.error(colors.red('💥 Error seeding users: 💥'), err);
      }
};

// Connect to MongoDB
mongoose.connect(config.database_url as string);
const seedSuperAdmin = async () => {
      try {
            logger.info(colors.cyan('🎨 --------------> Database seeding start <--------------- 🎨'));

            // Start seeding users
            await seedUsers();
            logger.info(colors.green('🎉 --------------> Database seeding completed <--------------- 🎉'));
      } catch (error) {
            logger.error(colors.red('🔥 Error creating Super Admin: 🔥'), error);
      } finally {
            mongoose.disconnect();
      }
};

seedSuperAdmin();
