import { z } from 'zod';

const createPackageZodSchema = z.object({
      body: z.object({
            name: z.string({ required_error: 'Name is required' }),
            price: z.number({ required_error: 'Price is required' }),
            interval: z.enum(['month', 'year'], {
                  errorMap: (issue, ctx) => {
                        return { message: 'Interval must be either month or year' };
                  },
            }),
            description: z.string({ required_error: 'Description is required' }),
            features: z.array(z.string({ required_error: 'Features are required' })),
      }),
});

export const PackageValidation = {
      createPackageZodSchema,
};
