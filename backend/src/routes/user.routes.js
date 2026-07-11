import { Router } from 'express';
import {
  ROLES,
  idParamSchema,
  updateUserRoleSchema,
  updateUserStatusSchema,
  userQuerySchema
} from '@biblioteca/shared';

import {
  getUser,
  getUsers,
  patchUserRole,
  patchUserStatus
} from '../controllers/user.controller.js';
import { authorize, protect } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';

const router = Router();

router.use(protect, authorize(ROLES.ADMIN));

router.get('/', validate(userQuerySchema, 'query'), getUsers);
router.get('/:id', validate(idParamSchema, 'params'), getUser);
router.patch(
  '/:id/role',
  validate(idParamSchema, 'params'),
  validate(updateUserRoleSchema),
  patchUserRole
);
router.patch(
  '/:id/status',
  validate(idParamSchema, 'params'),
  validate(updateUserStatusSchema),
  patchUserStatus
);

export default router;
