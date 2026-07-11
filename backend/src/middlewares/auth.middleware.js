import { User } from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AUTH_COOKIE_NAME } from '../utils/cookie.js';
import { verifyToken } from '../utils/jwt.js';

const BEARER_PREFIX = 'Bearer ';

const extractToken = (req) => {
  if (req.cookies?.[AUTH_COOKIE_NAME]) {
    return req.cookies[AUTH_COOKIE_NAME];
  }

  const authorization = req.headers.authorization;

  if (authorization?.startsWith(BEARER_PREFIX)) {
    return authorization.slice(BEARER_PREFIX.length);
  }

  return null;
};

export const protect = asyncHandler(async (req, res, next) => {
  const token = extractToken(req);

  if (!token) {
    throw new AppError('No autorizado. Inicie sesion para continuar', 401);
  }

  const payload = verifyToken(token);
  const user = await User.findById(payload.sub);

  if (!user) {
    throw new AppError('El usuario asociado al token ya no existe', 401);
  }

  if (!user.isActive) {
    throw new AppError('La cuenta se encuentra desactivada', 403);
  }

  req.user = user;
  return next();
});

export const authorize =
  (...allowedRoles) =>
  (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError('No tiene permisos para realizar esta accion', 403));
    }

    return next();
  };
