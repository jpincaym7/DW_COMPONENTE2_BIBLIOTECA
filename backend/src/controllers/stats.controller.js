import * as statsService from '../services/stats.service.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getSummary = asyncHandler(async (req, res) => {
  const summary = await statsService.getAdminSummary();

  return sendSuccess(res, { message: 'Resumen obtenido correctamente', data: summary });
});

export const getMySummary = asyncHandler(async (req, res) => {
  const summary = await statsService.getUserSummary(req.user.id);

  return sendSuccess(res, { message: 'Resumen obtenido correctamente', data: summary });
});
