import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required'),
});

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  phone: z
    .string()
    .regex(/^\+?[0-9]{10,15}$/, 'Please enter a valid phone number')
    .optional()
    .or(z.literal('')),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const alterationOrderSchema = z.object({
  addressId: z.number({ required_error: 'Please select a delivery address' }),
  scheduledDate: z
    .string()
    .min(1, 'Please select a date')
    .refine((date) => new Date(date) > new Date(), 'Date must be in the future'),
  scheduledSlot: z.enum(['MORNING_9_11', 'AFTERNOON_12_2', 'AFTERNOON_3_5', 'EVENING_6_8'], {
    required_error: 'Please select a time slot',
  }),
  items: z
    .array(
      z.object({
        alterationServiceId: z.number(),
        garmentDescription: z.string().max(500).optional(),
        customerNotes: z.string().max(500).optional(),
      })
    )
    .min(1, 'Please select at least one alteration service'),
  specialInstructions: z.string().max(1000).optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type AlterationOrderFormData = z.infer<typeof alterationOrderSchema>;
