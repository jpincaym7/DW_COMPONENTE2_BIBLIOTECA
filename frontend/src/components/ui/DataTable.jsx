import { Alert } from './Alert.jsx';
import { EmptyState } from './EmptyState.jsx';
import { CenteredSpinner } from './Spinner.jsx';
import styles from '../../styles/components/ui/DataTable.module.css';

const alignClassName = (align) => {
  if (align === 'right') {
    return styles.right;
  }

  if (align === 'center') {
    return styles.center;
  }

  return '';
};

const renderCell = (column, row) => (column.render ? column.render(row) : row[column.key]);

export const DataTable = ({
  columns,
  rows = [],
  isLoading = false,
  error = null,
  emptyTitle = 'Sin resultados',
  emptyMessage = 'No se encontraron registros con los criterios actuales',
  emptyAction = null,
  rowKey = (row) => row._id
}) => {
  if (isLoading) {
    return (
      <div className={styles.wrapper}>
        <CenteredSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.state}>
          <Alert variant="danger" title="No fue posible cargar la informacion">
            {error}
          </Alert>
        </div>
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className={styles.wrapper}>
        <EmptyState title={emptyTitle} message={emptyMessage} action={emptyAction} />
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.scroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key} className={alignClassName(column.align)}>
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={rowKey(row)}>
                {columns.map((column) => (
                  <td key={column.key} className={alignClassName(column.align)}>
                    {renderCell(column, row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
