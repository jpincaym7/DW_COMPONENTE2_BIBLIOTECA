import { AppError } from '../utils/AppError.js';

export const notFound = (req, res, next) => {
  next(new AppError(`La ruta ${req.originalUrl} no existe`, 404));
};
