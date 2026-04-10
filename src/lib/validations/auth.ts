import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().email('Institutional email format required'),
    password: z.string().min(6, 'Security requirement: Password must be at least 6 characters')
});

export const registrationSchema = z.object({
    fullName: z.string().min(3, 'Full identity required'),
    email: z.string().email(),
    password: z.string().min(8, 'Enhanced security: 8+ characters required for registration'),
    role: z.enum(['student', 'teacher', 'admin']).optional()
});
