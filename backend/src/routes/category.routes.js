import { Router } from 'express';
import {
  ROLES,
  categoryQuerySchema,
  createCategorySchema,
  idParamSchema,
  updateCategorySchema
} from '@biblioteca/shared';

import {
  getCategories,
  getCategory,
  postCategory,
  putCategory,
  removeCategory
} from '../controllers/category.controller.js';
import { authorize, protect } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';

const router = Router();

router.use(protect);

router.get('/', validate(categoryQuerySchema, 'query'), getCategories);
router.get('/:id', validate(idParamSchema, 'params'), getCategory);
router.post('/', authorize(ROLES.ADMIN), validate(createCategorySchema), postCategory);
router.put(
  '/:id',
  authorize(ROLES.ADMIN),
  validate(idParamSchema, 'params'),
  validate(updateCategorySchema),
  putCategory
);
router.delete('/:id', authorize(ROLES.ADMIN), validate(idParamSchema, 'params'), removeCategory);

export default router;
