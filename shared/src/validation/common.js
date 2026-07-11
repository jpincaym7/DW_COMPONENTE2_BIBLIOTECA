import { z } from 'zod';

import { MAX_PAGE_SIZE, PAGE_SIZE } from '../constants/limits.js';

const OBJECT_ID_PATTERN = /^[0-9a-fA-F]{24}$/;

export const objectIdSchema = z
  .string({ required_error: 'El identificador es obligatorio' })
  .regex(OBJECT_ID_PATTERN, 'El identificador no es valido');

export const optionalObjectIdSchema = z
  .string()
  .regex(OBJECT_ID_PATTERN, 'El identificador no es valido')
  .optional();

export const idParamSchema = z.object({
  id: objectIdSchema
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1, 'La pagina debe ser mayor a cero').default(1),
  limit: z.coerce
    .number()
    .int()
    .min(1, 'El limite debe ser mayor a cero')
    .max(MAX_PAGE_SIZE, `El limite maximo es ${MAX_PAGE_SIZE}`)
    .default(PAGE_SIZE),
  sort: z.string().trim().optional()
});

export const searchSchema = z.object({
  q: z.string().trim().max(100, 'La busqueda no puede exceder 100 caracteres').optional()
});

export const booleanQuerySchema = z
  .union([z.boolean(), z.enum(['true', 'false'])])
  .transform((value) => value === true || value === 'true')
  .optional();
