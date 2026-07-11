import { z } from 'zod';

import { paginationSchema } from './common.js';

export const createCategorySchema = z.object({
  name: z
    .string({ required_error: 'El nombre es obligatorio' })
    .trim()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(40, 'El nombre no puede exceder 40 caracteres'),
  description: z
    .string()
    .trim()
    .max(200, 'La descripcion no puede exceder 200 caracteres')
    .optional()
    .or(z.literal(''))
});

export const updateCategorySchema = createCategorySchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  'Debe enviar al menos un campo para actualizar'
);

export const categoryQuerySchema = paginationSchema.extend({
  q: z.string().trim().max(100, 'La busqueda no puede exceder 100 caracteres').optional()
});
