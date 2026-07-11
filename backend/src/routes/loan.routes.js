import { Router } from 'express';
import {
  ROLES,
  createLoanSchema,
  idParamSchema,
  loanQuerySchema,
  myLoanQuerySchema
} from '@biblioteca/shared';

import {
  getLoan,
  getLoans,
  getMyLoans,
  patchLoanReturn,
  postLoan,
  removeLoan
} from '../controllers/loan.controller.js';
import { authorize, protect } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';

const router = Router();

router.use(protect);

router.post('/', validate(createLoanSchema), postLoan);
router.get('/me', validate(myLoanQuerySchema, 'query'), getMyLoans);
router.get('/', authorize(ROLES.ADMIN), validate(loanQuerySchema, 'query'), getLoans);
router.get('/:id', validate(idParamSchema, 'params'), getLoan);
router.patch(
  '/:id/return',
  authorize(ROLES.ADMIN),
  validate(idParamSchema, 'params'),
  patchLoanReturn
);
router.delete('/:id', authorize(ROLES.ADMIN), validate(idParamSchema, 'params'), removeLoan);

export default router;
