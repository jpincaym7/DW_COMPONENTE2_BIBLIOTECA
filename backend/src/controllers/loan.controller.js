import * as loanService from '../services/loan.service.js';
import { sendCreated, sendSuccess } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const postLoan = asyncHandler(async (req, res) => {
  const loan = await loanService.createLoan(req.user, req.body);

  return sendCreated(res, { message: 'Prestamo registrado correctamente', data: loan });
});

export const getLoans = asyncHandler(async (req, res) => {
  const { items, meta } = await loanService.listLoans(req.validatedQuery);

  return sendSuccess(res, { message: 'Prestamos obtenidos correctamente', data: items, meta });
});

export const getMyLoans = asyncHandler(async (req, res) => {
  const { items, meta } = await loanService.listLoansByUser(req.user.id, req.validatedQuery);

  return sendSuccess(res, { message: 'Prestamos obtenidos correctamente', data: items, meta });
});

export const getLoan = asyncHandler(async (req, res) => {
  const loan = await loanService.getLoanById(req.user, req.params.id);

  return sendSuccess(res, { message: 'Prestamo obtenido correctamente', data: loan });
});

export const patchLoanReturn = asyncHandler(async (req, res) => {
  const loan = await loanService.returnLoan(req.params.id);

  return sendSuccess(res, { message: 'Devolucion registrada correctamente', data: loan });
});

export const removeLoan = asyncHandler(async (req, res) => {
  await loanService.deleteLoan(req.params.id);

  return sendSuccess(res, { message: 'Prestamo eliminado correctamente' });
});
