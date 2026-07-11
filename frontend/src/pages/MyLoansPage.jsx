import { LOAN_STATUS_LABELS, LOAN_STATUS_VALUES, MAX_ACTIVE_LOANS } from '@biblioteca/shared';

import { getMyLoans } from '../api/loans.api.js';
import { PageHeader } from '../components/layout/PageHeader.jsx';
import { DataTable } from '../components/ui/DataTable.jsx';
import { Pagination } from '../components/ui/Pagination.jsx';
import { Select } from '../components/ui/Select.jsx';
import { LoanStatusBadge } from '../features/loans/LoanStatusBadge.jsx';
import { useCrudList } from '../hooks/useCrudList.js';
import { formatDate } from '../utils/formatDate.js';

const INITIAL_FILTERS = { status: '' };

const STATUS_OPTIONS = LOAN_STATUS_VALUES.map((status) => ({
  value: status,
  label: LOAN_STATUS_LABELS[status]
}));

const COLUMNS = [
  { key: 'book', header: 'Libro', render: (loan) => loan.book?.title },
  { key: 'isbn', header: 'ISBN', render: (loan) => loan.book?.isbn },
  { key: 'loanDate', header: 'Fecha de prestamo', render: (loan) => formatDate(loan.loanDate) },
  { key: 'dueDate', header: 'Fecha de devolucion', render: (loan) => formatDate(loan.dueDate) },
  { key: 'returnDate', header: 'Devuelto el', render: (loan) => formatDate(loan.returnDate) },
  {
    key: 'status',
    header: 'Estado',
    align: 'center',
    render: (loan) => <LoanStatusBadge status={loan.status} />
  }
];

export const MyLoansPage = () => {
  const { items, meta, isLoading, error, page, setPage, filters, updateFilter } = useCrudList(getMyLoans, {
    initialFilters: INITIAL_FILTERS
  });

  return (
    <>
      <PageHeader
        title="Mis prestamos"
        subtitle={`Puede mantener hasta ${MAX_ACTIVE_LOANS} prestamos activos de forma simultanea`}
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
        columns={COLUMNS}
        rows={items}
        isLoading={isLoading}
        error={error}
        emptyTitle="Aun no tiene prestamos"
        emptyMessage="Explore el catalogo y solicite un libro para verlo aqui"
      />

      <Pagination page={page} totalPages={meta?.totalPages} total={meta?.total} onPageChange={setPage} />
    </>
  );
};
