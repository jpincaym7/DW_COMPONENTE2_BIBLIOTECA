import { isProduction } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

const DUPLICATE_KEY_CODE = 11000;

const buildDuplicateKeyError = (error) => {
  const field = Object.keys(error.keyValue ?? {})[0] ?? 'campo';
  return new AppError(`Ya existe un registro con ese ${field}`, 409, [
    { field, message: `El valor de ${field} ya esta registrado` }
  ]);
};

const buildMongooseValidationError = (error) => {
  const errors = Object.values(error.errors).map((item) => ({
    field: item.path,
    message: item.message
  }));

  return new AppError('Datos invalidos', 400, errors);
};

const normalizeError = (error) => {
  if (error instanceof AppError) {
    return error;
  }

  if (error.name === 'CastError') {
    return new AppError('El identificador enviado no es valido', 400);
  }

  if (error.code === DUPLICATE_KEY_CODE) {
    return buildDuplicateKeyError(error);
  }

  if (error.name === 'ValidationError') {
    return buildMongooseValidationError(error);
  }

  if (error.name === 'JsonWebTokenError') {
    return new AppError('El token no es valido', 401);
  }

  if (error.name === 'TokenExpiredError') {
    return new AppError('La sesion ha expirado. Inicie sesion nuevamente', 401);
  }

  return new AppError('Error interno del servidor', 500);
};

export const errorHandler = (error, req, res, next) => {
  const normalized = normalizeError(error);

  const payload = {
    success: false,
    message: normalized.message,
    errors: normalized.errors
  };

  if (!isProduction && normalized.statusCode === 500) {
    payload.stack = error.stack;
  }

  return res.status(normalized.statusCode).json(payload);
};
