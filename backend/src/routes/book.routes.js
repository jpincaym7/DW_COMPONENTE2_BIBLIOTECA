import { Router } from 'express';
import {
  ROLES,
  bookQuerySchema,
  createBookSchema,
  idParamSchema,
  updateBookSchema
} from '@biblioteca/shared';

import { getBook, getBooks, postBook, putBook, removeBook } from '../controllers/book.controller.js';
import { authorize, protect } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';

const router = Router();

router.use(protect);

router.get('/', validate(bookQuerySchema, 'query'), getBooks);
router.get('/:id', validate(idParamSchema, 'params'), getBook);
router.post('/', authorize(ROLES.ADMIN), validate(createBookSchema), postBook);
router.put(
  '/:id',
  authorize(ROLES.ADMIN),
  validate(idParamSchema, 'params'),
  validate(updateBookSchema),
  putBook
);
router.delete('/:id', authorize(ROLES.ADMIN), validate(idParamSchema, 'params'), removeBook);

export default router;
