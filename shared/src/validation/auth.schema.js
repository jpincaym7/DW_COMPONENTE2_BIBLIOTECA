import { z } from 'zod';

import { PASSWORD_MIN_LENGTH } from '../constants/limits.js';

export const nameSchema = z
  .string({ required_error: 'El nombre es obligatorio' })
  .trim()
  .min(3, 'El nombre debe tener al menos 3 caracteres')
  .max(60, 'El nombre no puede exceder 60 caracteres');

export const emailSchema = z
  .string({ required_error: 'El correo es obligatorio' })
  .trim()
  .toLowerCase()
  .min(1, 'El correo es obligatorio')
  .email('El correo no tiene un formato valido');

export const passwordSchema = z
  .string({ required_error: 'La contrasena es obligatoria' })
  .min(PASSWORD_MIN_LENGTH, `La contrasena debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres`)
  .max(64, 'La contrasena no puede exceder 64 caracteres')
  .regex(/[a-zA-Z]/, 'La contrasena debe incluir al menos una letra')
  .regex(/[0-9]/, 'La contrasena debe incluir al menos un numero');

export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string({ required_error: 'La contrasena es obligatoria' }).min(1, 'La contrasena es obligatoria')
});
