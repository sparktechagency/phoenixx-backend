import { z } from 'zod';

const createPostZodSchema = z.object({
      body: z.object({
            title: z.string({
                  required_error: 'Title is required',
            }),
            content: z.string({
                  required_error: 'Content is required',
            }),
            category: z.string({
                  required_error: 'Category is required',
            }),
            // subCategory: z.string({
            //       required_error: 'SubCategory is required',
            // }),
      }),
});

export const PostValidation = {
      createPostZodSchema,
};
