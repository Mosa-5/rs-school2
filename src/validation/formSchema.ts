import { z } from 'zod';
import { isValidEmail } from '../utils/email';

export const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg'];
export const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2 MB

export const GENDER_OPTIONS = ['male', 'female', 'other'] as const;

function startsWithUppercase(value: string): boolean {
  const first = value.charAt(0);
  return first !== first.toLowerCase() && first === first.toUpperCase();
}

const imageSchema = z
  .instanceof(File, { message: 'Image is required' })
  .refine((file) => file.size > 0, { message: 'Image is required' })
  .refine((file) => ALLOWED_IMAGE_TYPES.includes(file.type), {
    message: 'Image must be a PNG or JPEG file',
  })
  .refine((file) => file.size <= MAX_IMAGE_SIZE, {
    message: 'Image must be 2 MB or smaller',
  });

export function createFormSchema(countries: string[]) {
  return z
    .object({
      name: z
        .string()
        .min(1, 'Name is required')
        .refine(startsWithUppercase, {
          message: 'Name must start with an uppercase letter',
        }),
      age: z.preprocess(
        (value) =>
          typeof value === 'string' && value.trim() === '' ? undefined : value,
        z.coerce
          .number({ message: 'Age must be a number' })
          .refine((value) => !Number.isNaN(value), 'Age must be a number')
          .min(0, 'Age cannot be negative')
      ),
      email: z.string().refine(isValidEmail, 'Enter a valid email address'),
      gender: z.enum(GENDER_OPTIONS, { message: 'Select a gender' }),
      country: z
        .string()
        .min(1, 'Select a country')
        .refine((value) => countries.includes(value), {
          message: 'Select a country from the list',
        }),
      password: z.string().min(1, 'Password is required'),
      confirmPassword: z.string().min(1, 'Confirm your password'),
      acceptTerms: z
        .boolean()
        .refine((value) => value === true, {
          message: 'You must accept the Terms and Conditions',
        }),
      image: imageSchema,
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Passwords must match',
      path: ['confirmPassword'],
    });
}

export type FormValues = z.infer<ReturnType<typeof createFormSchema>>;
