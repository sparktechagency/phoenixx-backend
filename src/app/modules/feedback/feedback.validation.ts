import { z } from 'zod';

const createFeedbackZodSchema = z.object({
      body: z.object({
            likedAspects: z.string({
                  required_error: 'Liked Aspects is required',
            }),
            areasForImprovement: z.string({
                  required_error: 'Areas For Improvement is required',
            }),
            featureSuggestions: z.string({
                  required_error: 'Feature Suggestions is required',
            }),
            additionalFeedback: z.string({
                  required_error: 'Additional Feedback is required',
            }),
      }),
});

export const FeedbackValidation = {
      createFeedbackZodSchema,
};
