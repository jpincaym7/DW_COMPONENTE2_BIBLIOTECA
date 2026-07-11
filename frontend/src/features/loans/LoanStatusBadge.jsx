import { LOAN_STATUS_LABELS, LOAN_STATUS_VARIANTS } from '@biblioteca/shared';

import { Badge } from '../../components/ui/Badge.jsx';

export const LoanStatusBadge = ({ status }) => (
  <Badge variant={LOAN_STATUS_VARIANTS[status]}>{LOAN_STATUS_LABELS[status]}</Badge>
);
