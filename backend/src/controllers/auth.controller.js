import { loginUser, registerUser } from '../services/auth.service.js';
import { sendCreated, sendSuccess } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { clearAuthCookie, setAuthCookie } from '../utils/cookie.js';

export const register = asyncHandler(async (req, res) => {
  const { user, token } = await registerUser(req.body);

  setAuthCookie(res, token);

  return sendCreated(res, {
    message: 'Cuenta creada correctamente',
    data: { user, token }
  });
});

export const login = asyncHandler(async (req, res) => {
  const { user, token } = await loginUser(req.body);

  setAuthCookie(res, token);

  return sendSuccess(res, {
    message: 'Sesion iniciada correctamente',
    data: { user, token }
  });
});

export const logout = asyncHandler(async (req, res) => {
  clearAuthCookie(res);

  return sendSuccess(res, { message: 'Sesion cerrada correctamente' });
});

export const getProfile = asyncHandler(async (req, res) =>
  sendSuccess(res, {
    message: 'Perfil obtenido correctamente',
    data: { user: req.user }
  })
);
