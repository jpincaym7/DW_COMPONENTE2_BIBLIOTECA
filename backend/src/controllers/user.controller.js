import * as userService from '../services/user.service.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getUsers = asyncHandler(async (req, res) => {
  const { items, meta } = await userService.listUsers(req.validatedQuery);

  return sendSuccess(res, { message: 'Usuarios obtenidos correctamente', data: items, meta });
});

export const getUser = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);

  return sendSuccess(res, { message: 'Usuario obtenido correctamente', data: user });
});

export const patchUserRole = asyncHandler(async (req, res) => {
  const user = await userService.updateUserRole(req.user, req.params.id, req.body.role);

  return sendSuccess(res, { message: 'Rol actualizado correctamente', data: user });
});

export const patchUserStatus = asyncHandler(async (req, res) => {
  const user = await userService.updateUserStatus(req.user, req.params.id, req.body.isActive);

  return sendSuccess(res, { message: 'Estado actualizado correctamente', data: user });
});
