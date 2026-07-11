import { z } from 'zod';

import { LOAN_STATUS_VALUES } from '../constants/loanStatus.js';
import { objectIdSchema, optionalObjectIdSchema, paginationSchema } from './common.js';

export const createLoanSchema = z.object({
  book: objectIdSchema,
  user: optionalObjectIdSchema,
  dueDate: z.coerce
    .date({ invalid_type_error: 'La fecha de devolucion no es valida' })
    .refine((value) => value.getTime() > Date.now(), 'La fecha de devolucion debe ser futura')
    .optional(),
  notes: z.string().trim().max(300, 'Las notas no pueden exceder 300 caracteres').optional().or(z.literal(''))
});

export const loanQuerySchema = paginationSchema.extend({
  status: z.enum(LOAN_STATUS_VALUES, { invalid_type_error: 'El estado no es valido' }).optional(),
  user: optionalObjectIdSchema,
  book: optionalObjectIdSchema
});

export const myLoanQuerySchema = paginationSchema.extend({
  status: z.enum(LOAN_STATUS_VALUES, { invalid_type_error: 'El estado no es valido' }).optional()
});
