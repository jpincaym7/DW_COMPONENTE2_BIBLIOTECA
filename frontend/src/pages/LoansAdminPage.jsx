import { useState } from 'react';
import { LOAN_STATUS, LOAN_STATUS_LABELS, LOAN_STATUS_VALUES } from '@biblioteca/shared';

import { getLoans, returnLoan } from '../api/loans.api.js';
import { PageHeader } from '../components/layout/PageHeader.jsx';
import { Button } from '../components/ui/Button.jsx';
import { ConfirmDialog } from '../components/ui/ConfirmDialog.jsx';
import { DataTable } from '../components/ui/DataTable.jsx';
import { Pagination } from '../components/ui/Pagination.jsx';
import { Select } from '../components/ui/Select.jsx';
import { LoanStatusBadge } from '../features/loans/LoanStatusBadge.jsx';
import { useCrudList } from '../hooks/useCrudList.js';
import { useModal } from '../hooks/useModal.js';
import { useToast } from '../hooks/useToast.js';
import { formatDate } from '../utils/formatDate.js';

const INITIAL_FILTERS = { status: '' };

const STATUS_OPTIONS = LOAN_STATUS_VALUES.map((status) => ({
  value: status,
  label: LOAN_STATUS_LABELS[status]
}));

export const LoansAdminPage = () => {
  const { showToast } = useToast();
  const returnDialog = useModal();
  const [isReturning, setIsReturning] = useState(false);

  const { items, meta, isLoading, error, page, setPage, filters, updateFilter, refetch } = useCrudList(
    getLoans,
    { initialFilters: INITIAL_FILTERS }
  );

  const handleReturn = async () => {
    setIsReturning(true);

    try {
      await returnLoan(returnDialog.selected._id);
      showToast({ type: 'success', message: 'Devolucion registrada correctamente' });
      await refetch();
    } catch (apiError) {
      showToast({ type: 'danger', message: apiError.message });
    } finally {
      setIsReturning(false);
      returnDialog.close();
    }
  };

  const columns = [
    { key: 'book', header: 'Libro', render: (loan) => loan.book?.title },
    { key: 'user', header: 'Usuario', render: (loan) => loan.user?.name },
    { key: 'email', header: 'Correo', render: (loan) => loan.user?.email },
    { key: 'loanDate', header: 'Prestado el', render: (loan) => formatDate(loan.loanDate) },
    { key: 'dueDate', header: 'Vence el', render: (loan) => formatDate(loan.dueDate) },
    {
      key: 'status',
      header: 'Estado',
      align: 'center',
      render: (loan) => <LoanStatusBadge status={loan.status} />
    },
    {
      key: 'actions',
      header: 'Acciones',
      align: 'right',
      render: (loan) =>
        loan.status === LOAN_STATUS.RETURNED ? null : (
          <Button variant="secondary" size="sm" onClick={() => returnDialog.open(loan)}>
            Registrar devolucion
          </Button>
        )
    }
  ];

  return (
    <>
      <PageHeader
        title="Gestion de prestamos"
        subtitle="Consulte los prestamos de la biblioteca y registre las devoluciones"
        actions={
          <Select
            placeholder="Todos los estados"
            aria-label="Filtrar por estado"
            value={filters.status ?? ''}
            onChange={(event) => updateFilter('status', event.target.value)}
            options={STATUS_OPTIONS}
          />
        }
      />

      <DataTable
        columns={columns}
        rows={items}
        isLoading={isLoading}
        error={error}
        emptyTitle="No hay prestamos registrados"
        emptyMessage="Los prestamos solicitados por los usuarios apareceran en esta tabla"
      />

      <Pagination page={page} totalPages={meta?.totalPages} total={meta?.total} onPageChange={setPage} />

      <ConfirmDialog
        isOpen={returnDialog.isOpen}
        title="Registrar devolucion"
        message={`Confirma la devolucion de "${returnDialog.selected?.book?.title}" por parte de ${returnDialog.selected?.user?.name}?`}
        confirmLabel="Registrar devolucion"
        variant="primary"
        isLoading={isReturning}
        onConfirm={handleReturn}
        onCancel={returnDialog.close}
      />
    </>
  );
};
