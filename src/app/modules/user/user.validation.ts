import { z } from 'zod';

const createUserZodSchema = z.object({
      body: z.object({
            userName: z
                  .string({ required_error: 'User Name is required' })
                  .min(3, 'User Name must be at least 3 characters long')
                  .max(30, 'User Name must be at most 30 characters long')
                  .toLowerCase()
                  .trim(),

            contact: z.string().optional(),
            email: z.string({ required_error: 'Email is required' }),
            password: z.string({ required_error: 'Password is required' }),
            location: z.string().optional(),
            profile: z.string().optional(),
      }),
});

const userStatusZodSchema = z.object({
      body: z.object({
            status: z.enum(['active', 'delete'], {
                  required_error: 'User Status is required',
            }),
      }),
});

export const UserValidation = {
      createUserZodSchema,
      userStatusZodSchema,
};
