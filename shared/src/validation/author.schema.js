import { z } from 'zod';

import { MIN_PUBLICATION_YEAR } from '../constants/limits.js';
import { paginationSchema } from './common.js';

export const createAuthorSchema = z.object({
  name: z
    .string({ required_error: 'El nombre es obligatorio' })
    .trim()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(80, 'El nombre no puede exceder 80 caracteres'),
  nationality: z
    .string()
    .trim()
    .max(50, 'La nacionalidad no puede exceder 50 caracteres')
    .optional()
    .or(z.literal('')),
  birthYear: z.preprocess(
    (value) => (value === '' || value === null ? undefined : value),
    z.coerce
      .number({ invalid_type_error: 'El anio debe ser un numero' })
      .int('El anio debe ser un numero entero')
      .min(MIN_PUBLICATION_YEAR, `El anio no puede ser anterior a ${MIN_PUBLICATION_YEAR}`)
      .max(new Date().getFullYear(), 'El anio no puede ser posterior al actual')
      .optional()
  )
});

export const updateAuthorSchema = createAuthorSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  'Debe enviar al menos un campo para actualizar'
);

export const authorQuerySchema = paginationSchema.extend({
  q: z.string().trim().max(100, 'La busqueda no puede exceder 100 caracteres').optional()
});
