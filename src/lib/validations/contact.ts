import { z } from 'zod';

export const contactEnquirySchema = z.object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters'),
    contact: z.string().trim().min(6, 'Please enter a valid phone number or email address'),
    module: z.string().trim().min(1, 'Target subject or grade selection required'),
    requirements: z.string().trim().min(2, 'Please provide details about your requirements')
});
