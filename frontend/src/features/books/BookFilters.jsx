import { Button } from '../../components/ui/Button.jsx';
import { Checkbox } from '../../components/ui/Checkbox.jsx';
import { SearchInput } from '../../components/ui/SearchInput.jsx';
import { Select } from '../../components/ui/Select.jsx';
import styles from '../../styles/features/books/BookFilters.module.css';

export const BookFilters = ({
  search,
  onSearchChange,
  filters,
  onFilterChange,
  onReset,
  categories,
  authors
}) => (
  <div className={styles.filters}>
    <SearchInput
      value={search}
      onChange={(event) => onSearchChange(event.target.value)}
      placeholder="Buscar por titulo, ISBN o editorial"
    />

    <Select
      className={styles.select}
      placeholder="Todas las categorias"
      aria-label="Filtrar por categoria"
      value={filters.category ?? ''}
      onChange={(event) => onFilterChange('category', event.target.value)}
      options={categories.map((category) => ({ value: category._id, label: category.name }))}
    />

    <Select
      className={styles.select}
      placeholder="Todos los autores"
      aria-label="Filtrar por autor"
      value={filters.author ?? ''}
      onChange={(event) => onFilterChange('author', event.target.value)}
      options={authors.map((author) => ({ value: author._id, label: author.name }))}
    />

    <Checkbox
      label="Solo disponibles"
      checked={Boolean(filters.available)}
      onChange={(event) => onFilterChange('available', event.target.checked ? 'true' : '')}
    />

    <div className={styles.spacer} />

    <Button variant="ghost" size="sm" onClick={onReset}>
      Limpiar filtros
    </Button>
  </div>
);
