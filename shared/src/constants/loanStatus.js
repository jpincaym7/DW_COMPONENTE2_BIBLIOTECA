export const LOAN_STATUS = {
  ACTIVE: 'active',
  RETURNED: 'returned',
  OVERDUE: 'overdue'
};

export const LOAN_STATUS_VALUES = Object.values(LOAN_STATUS);

export const LOAN_STATUS_LABELS = {
  [LOAN_STATUS.ACTIVE]: 'Activo',
  [LOAN_STATUS.RETURNED]: 'Devuelto',
  [LOAN_STATUS.OVERDUE]: 'Vencido'
};

export const LOAN_STATUS_VARIANTS = {
  [LOAN_STATUS.ACTIVE]: 'info',
  [LOAN_STATUS.RETURNED]: 'success',
  [LOAN_STATUS.OVERDUE]: 'danger'
};
