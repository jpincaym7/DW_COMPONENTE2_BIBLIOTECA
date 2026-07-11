import { Router } from 'express';
import {
  ROLES,
  authorQuerySchema,
  createAuthorSchema,
  idParamSchema,
  updateAuthorSchema
} from '@biblioteca/shared';

import {
  getAuthor,
  getAuthors,
  postAuthor,
  putAuthor,
  removeAuthor
} from '../controllers/author.controller.js';
import { authorize, protect } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';

const router = Router();

router.use(protect);

router.get('/', validate(authorQuerySchema, 'query'), getAuthors);
router.get('/:id', validate(idParamSchema, 'params'), getAuthor);
router.post('/', authorize(ROLES.ADMIN), validate(createAuthorSchema), postAuthor);
router.put(
  '/:id',
  authorize(ROLES.ADMIN),
  validate(idParamSchema, 'params'),
  validate(updateAuthorSchema),
  putAuthor
);
router.delete('/:id', authorize(ROLES.ADMIN), validate(idParamSchema, 'params'), removeAuthor);

export default router;
