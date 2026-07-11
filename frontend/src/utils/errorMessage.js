const DEFAULT_MESSAGE = 'Ocurrio un error inesperado. Intente nuevamente';

export const normalizeApiError = (error) => {
  const response = error.response;

  if (!response) {
    return {
      message: 'No fue posible conectar con el servidor',
      errors: [],
      status: 0
    };
  }

  return {
    message: response.data?.message ?? DEFAULT_MESSAGE,
    errors: response.data?.errors ?? [],
    status: response.status
  };
};

export const getFieldErrors = (errors = []) =>
  errors.reduce((accumulator, item) => {
    accumulator[item.field] = item.message;
    return accumulator;
  }, {});
