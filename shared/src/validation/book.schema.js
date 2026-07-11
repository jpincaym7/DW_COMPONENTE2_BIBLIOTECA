import { z } from 'zod';

import { MIN_PUBLICATION_YEAR } from '../constants/limits.js';
import { booleanQuerySchema, objectIdSchema, optionalObjectIdSchema, paginationSchema } from './common.js';

const ISBN_PATTERN = /^(?:\d{9}[\dX]|\d{13})$/;

const normalizeIsbn = (value) => (typeof value === 'string' ? value.replace(/[-\s]/g, '') : value);

export const isbnSchema = z
  .string({ required_error: 'El ISBN es obligatorio' })
  .trim()
  .transform(normalizeIsbn)
  .refine((value) => ISBN_PATTERN.test(value), 'El ISBN debe tener 10 o 13 digitos');

export const titleSchema = z
  .string({ required_error: 'El titulo es obligatorio' })
  .trim()
  .min(2, 'El titulo debe tener al menos 2 caracteres')
  .max(150, 'El titulo no puede exceder 150 caracteres');

export const publicationYearSchema = z.coerce
  .number({ invalid_type_error: 'El anio debe ser un numero' })
  .int('El anio debe ser un numero entero')
  .min(MIN_PUBLICATION_YEAR, `El anio no puede ser anterior a ${MIN_PUBLICATION_YEAR}`)
  .max(new Date().getFullYear(), 'El anio no puede ser posterior al actual');

export const createBookSchema = z.object({
  title: titleSchema,
  isbn: isbnSchema,
  author: objectIdSchema,
  category: objectIdSchema,
  publisher: z.string().trim().max(80, 'La editorial no puede exceder 80 caracteres').optional().or(z.literal('')),
  publicationYear: publicationYearSchema,
  description: z
    .string()
    .trim()
    .max(1000, 'La descripcion no puede exceder 1000 caracteres')
    .optional()
    .or(z.literal('')),
  coverUrl: z.string().trim().url('La portada debe ser una URL valida').optional().or(z.literal('')),
  totalCopies: z.coerce
    .number({ invalid_type_error: 'Los ejemplares deben ser un numero' })
    .int('Los ejemplares deben ser un numero entero')
    .min(1, 'Debe existir al menos un ejemplar')
    .max(999, 'No se admiten mas de 999 ejemplares')
});

export const updateBookSchema = createBookSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  'Debe enviar al menos un campo para actualizar'
);

export const bookQuerySchema = paginationSchema.extend({
  q: z.string().trim().max(100, 'La busqueda no puede exceder 100 caracteres').optional(),
  category: optionalObjectIdSchema,
  author: optionalObjectIdSchema,
  available: booleanQuerySchema
});
