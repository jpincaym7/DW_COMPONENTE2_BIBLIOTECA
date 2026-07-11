import { AppError } from '../utils/AppError.js';

const toFieldErrors = (issues) =>
  issues.map((issue) => ({
    field: issue.path.join('.') || 'general',
    message: issue.message
  }));

export const validate =
  (schema, source = 'body') =>
  (req, res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      return next(new AppError('Datos invalidos', 400, toFieldErrors(result.error.issues)));
    }

    if (source === 'query') {
      req.validatedQuery = result.data;
    } else {
      req[source] = result.data;
    }

    return next();
  };
