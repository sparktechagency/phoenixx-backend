import { z } from 'zod';

const warningReportZodSchema = z.object({
      body: z.object({
            message: z.string({
                  required_error: 'Message is required',
            }),
      }),
});

export const ReportValidation = {
      warningReportZodSchema,
};
