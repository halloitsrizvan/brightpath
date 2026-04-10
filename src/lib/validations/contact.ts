import { z } from 'zod';

export const contactEnquirySchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    contact: z.string().min(10, 'Valid contact number required'),
    module: z.string().min(1, 'Target module/grade selection required'),
    requirements: z.string().min(10, 'Please provide more details about your requirements')
});
