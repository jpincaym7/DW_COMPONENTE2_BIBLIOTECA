export const sendSuccess = (res, { message = 'Operacion exitosa', data = null, meta = null, statusCode = 200 } = {}) => {
  const payload = { success: true, message, data };

  if (meta) {
    payload.meta = meta;
  }

  return res.status(statusCode).json(payload);
};

export const sendCreated = (res, { message = 'Recurso creado', data = null } = {}) =>
  sendSuccess(res, { message, data, statusCode: 201 });

export const buildPaginationMeta = ({ page, limit, total }) => ({
  page,
  limit,
  total,
  totalPages: limit > 0 ? Math.ceil(total / limit) : 0
});
