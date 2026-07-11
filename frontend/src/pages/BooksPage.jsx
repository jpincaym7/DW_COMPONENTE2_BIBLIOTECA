import { useNavigate } from 'react-router-dom';
import { MAX_PAGE_SIZE } from '@biblioteca/shared';

import { getAuthors } from '../api/authors.api.js';
import { getBooks } from '../api/books.api.js';
import { getCategories } from '../api/categories.api.js';
import { Icon } from '../components/icons/Icon.jsx';
import { PageHeader } from '../components/layout/PageHeader.jsx';
import { Alert } from '../components/ui/Alert.jsx';
import { Button } from '../components/ui/Button.jsx';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import { Pagination } from '../components/ui/Pagination.jsx';
import { CenteredSpinner } from '../components/ui/Spinner.jsx';
import { BookCard } from '../features/books/BookCard.jsx';
import { BookFilters } from '../features/books/BookFilters.jsx';
import { useApi } from '../hooks/useApi.js';
import { useAuth } from '../hooks/useAuth.js';
import { useCrudList } from '../hooks/useCrudList.js';
import { PATHS } from '../routes/paths.js';
import styles from '../styles/pages/BooksPage.module.css';

const INITIAL_FILTERS = { category: '', author: '', available: '' };
const REFERENCE_PARAMS = { limit: MAX_PAGE_SIZE };

export const BooksPage = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const { items, meta, isLoading, error, page, setPage, search, setSearch, filters, updateFilter, resetFilters } =
    useCrudList(getBooks, { initialFilters: INITIAL_FILTERS, limit: 12 });

  const { data: categories } = useApi(getCategories, { params: REFERENCE_PARAMS });
  const { data: authors } = useApi(getAuthors, { params: REFERENCE_PARAMS });

  const renderContent = () => {
    if (isLoading) {
      return <CenteredSpinner />;
    }

    if (error) {
      return (
        <Alert variant="danger" title="No fue posible cargar el catalogo">
          {error}
        </Alert>
      );
    }

    if (items.length === 0) {
      return (
        <div className={styles.panel}>
          <EmptyState
            icon="books"
            title="No se encontraron libros"
            message="Ajuste los filtros o realice una busqueda diferente"
            action={
              <Button variant="secondary" onClick={resetFilters}>
                Limpiar filtros
              </Button>
            }
          />
        </div>
      );
    }

    return (
      <div className={styles.grid}>
        {items.map((book) => (
          <BookCard key={book._id} book={book} />
        ))}
      </div>
    );
  };

  return (
    <>
      <PageHeader
        title="Catalogo"
        subtitle="Consulte los libros disponibles en la biblioteca"
        actions={
          isAdmin ? (
            <Button onClick={() => navigate(PATHS.BOOK_NEW)}>
              <Icon name="plus" size="sm" />
              Nuevo libro
            </Button>
          ) : null
        }
      />

      <BookFilters
        search={search}
        onSearchChange={setSearch}
        filters={filters}
        onFilterChange={updateFilter}
        onReset={resetFilters}
        categories={categories ?? []}
        authors={authors ?? []}
      />

      {renderContent()}

      <Pagination
        page={page}
        totalPages={meta?.totalPages}
        total={meta?.total}
        onPageChange={setPage}
      />
    </>
  );
};
