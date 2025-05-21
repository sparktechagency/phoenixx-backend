import { z } from 'zod';

const createCommentZodSchema = z.object({
      body: z.object({
            postId: z.string({
                  required_error: 'Post ID is required',
            }),
            content: z.string({
                  required_error: 'Content is required',
            }),
      }),
});

export const CommentValidation = {
      createCommentZodSchema,
};
