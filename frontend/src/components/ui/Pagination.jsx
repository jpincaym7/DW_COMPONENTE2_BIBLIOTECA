import { IconButton } from './IconButton.jsx';
import styles from '../../styles/components/ui/Pagination.module.css';

export const Pagination = ({ page, totalPages, total, onPageChange }) => {
  if (!totalPages || totalPages <= 1) {
    return null;
  }

  return (
    <nav className={styles.pagination} aria-label="Paginacion">
      <span className={styles.summary}>
        {total} registros encontrados
      </span>

      <div className={styles.controls}>
        <IconButton
          icon="chevronLeft"
          label="Pagina anterior"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        />

        <span className={styles.current}>
          Pagina {page} de {totalPages}
        </span>

        <IconButton
          icon="chevronRight"
          label="Pagina siguiente"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        />
      </div>
    </nav>
  );
};
