const DATE_FORMATTER = new Intl.DateTimeFormat('es-EC', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric'
});

export const formatDate = (value) => {
  if (!value) {
    return 'Sin registrar';
  }

  return DATE_FORMATTER.format(new Date(value));
};

export const toInputDate = (value) => {
  if (!value) {
    return '';
  }

  return new Date(value).toISOString().slice(0, 10);
};

export const daysUntil = (value) => {
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const difference = new Date(value).getTime() - Date.now();

  return Math.ceil(difference / millisecondsPerDay);
};
