import { useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LOAN_DAYS } from '@biblioteca/shared';

import { deleteBook, getBookById } from '../api/books.api.js';
import { createLoan } from '../api/loans.api.js';
import { Icon } from '../components/icons/Icon.jsx';
import { PageHeader } from '../components/layout/PageHeader.jsx';
import { Alert } from '../components/ui/Alert.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Card } from '../components/ui/Card.jsx';
import { ConfirmDialog } from '../components/ui/ConfirmDialog.jsx';
import { CenteredSpinner } from '../components/ui/Spinner.jsx';
import { BookCover } from '../features/books/BookCover.jsx';
import { useApi } from '../hooks/useApi.js';
import { useAuth } from '../hooks/useAuth.js';
import { useModal } from '../hooks/useModal.js';
import { useToast } from '../hooks/useToast.js';
import { PATHS } from '../routes/paths.js';
import styles from '../styles/pages/BookDetailPage.module.css';

const MetaItem = ({ label, value }) => (
  <div className={styles.metaItem}>
    <span className={styles.metaLabel}>{label}</span>
    <span className={styles.metaValue}>{value}</span>
  </div>
);

export const BookDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { showToast } = useToast();
  const deleteDialog = useModal();

  const [isBorrowing, setIsBorrowing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchBook = useCallback(() => getBookById(id), [id]);
  const { data: book, isLoading, error, refetch } = useApi(fetchBook);

  const handleBorrow = async () => {
    setIsBorrowing(true);

    try {
      await createLoan({ book: id });
      showToast({ type: 'success', message: `Prestamo registrado por ${LOAN_DAYS} dias` });
      await refetch();
    } catch (apiError) {
      showToast({ type: 'danger', message: apiError.message });
    } finally {
      setIsBorrowing(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      await deleteBook(id);
      showToast({ type: 'success', message: 'Libro eliminado correctamente' });
      navigate(PATHS.BOOKS, { replace: true });
    } catch (apiError) {
      showToast({ type: 'danger', message: apiError.message });
      deleteDialog.close();
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return <CenteredSpinner />;
  }

  if (error) {
    return (
      <Alert variant="danger" title="No fue posible cargar el libro">
        {error}
      </Alert>
    );
  }

  if (!book) {
    return null;
  }

  const isAvailable = book.availableCopies > 0;

  return (
    <>
      <PageHeader
        title={book.title}
        subtitle={book.author?.name}
        actions={
          <Button variant="ghost" onClick={() => navigate(PATHS.BOOKS)}>
            <Icon name="arrowLeft" size="sm" />
            Volver al catalogo
          </Button>
        }
      />

      <div className={styles.layout}>
        <BookCover url={book.coverUrl} title={book.title} size="lg" />

        <div className={styles.details}>
          <div className={styles.badges}>
            <Badge variant="neutral">{book.category?.name}</Badge>
            <Badge variant={isAvailable ? 'success' : 'danger'}>
              {isAvailable
                ? `${book.availableCopies} de ${book.totalCopies} disponibles`
                : 'Sin ejemplares disponibles'}
            </Badge>
          </div>

          <Card title="Informacion del libro">
            <div className={styles.metaGrid}>
              <MetaItem label="ISBN" value={book.isbn} />
              <MetaItem label="Editorial" value={book.publisher || 'Sin registrar'} />
              <MetaItem label="Anio de publicacion" value={book.publicationYear} />
              <MetaItem label="Nacionalidad del autor" value={book.author?.nationality || 'Sin registrar'} />
              <MetaItem label="Ejemplares totales" value={book.totalCopies} />
              <MetaItem label="Ejemplares disponibles" value={book.availableCopies} />
            </div>
          </Card>

          {book.description ? (
            <Card title="Descripcion">
              <p className={styles.description}>{book.description}</p>
            </Card>
          ) : null}

          <div className={styles.actions}>
            <Button size="lg" onClick={handleBorrow} isLoading={isBorrowing} disabled={!isAvailable}>
              <Icon name="clock" size="sm" />
              Solicitar prestamo
            </Button>

            {isAdmin ? (
              <>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => navigate(PATHS.BOOK_EDIT(book._id))}
                >
                  <Icon name="edit" size="sm" />
                  Editar
                </Button>

                <Button variant="danger" size="lg" onClick={() => deleteDialog.open(book)}>
                  <Icon name="trash" size="sm" />
                  Eliminar
                </Button>
              </>
            ) : null}
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Eliminar libro"
        message={`Esta seguro de eliminar "${book.title}"? Esta accion no se puede deshacer.`}
        confirmLabel="Eliminar"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={deleteDialog.close}
      />
    </>
  );
};
