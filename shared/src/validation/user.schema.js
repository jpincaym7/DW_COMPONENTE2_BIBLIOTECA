import { z } from 'zod';

import { ROLE_VALUES } from '../constants/roles.js';
import { paginationSchema } from './common.js';

export const updateUserRoleSchema = z.object({
  role: z.enum(ROLE_VALUES, { invalid_type_error: 'El rol no es valido' })
});

export const updateUserStatusSchema = z.object({
  isActive: z.boolean({ required_error: 'El estado es obligatorio' })
});

export const userQuerySchema = paginationSchema.extend({
  q: z.string().trim().max(100, 'La busqueda no puede exceder 100 caracteres').optional(),
  role: z.enum(ROLE_VALUES, { invalid_type_error: 'El rol no es valido' }).optional()
});
