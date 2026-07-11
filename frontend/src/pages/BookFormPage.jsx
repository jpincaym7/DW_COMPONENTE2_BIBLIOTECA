import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MAX_PAGE_SIZE } from '@biblioteca/shared';

import { getAuthors } from '../api/authors.api.js';
import { createBook, getBookById, updateBook } from '../api/books.api.js';
import { getCategories } from '../api/categories.api.js';
import { PageHeader } from '../components/layout/PageHeader.jsx';
import { Alert } from '../components/ui/Alert.jsx';
import { Card } from '../components/ui/Card.jsx';
import { CenteredSpinner } from '../components/ui/Spinner.jsx';
import { BookForm, EMPTY_BOOK, toBookFormValues } from '../features/books/BookForm.jsx';
import { useApi } from '../hooks/useApi.js';
import { useToast } from '../hooks/useToast.js';
import { PATHS } from '../routes/paths.js';

const REFERENCE_PARAMS = { limit: MAX_PAGE_SIZE };

export const BookFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const isEditing = Boolean(id);

  const fetchBook = useCallback(() => getBookById(id), [id]);

  const { data: book, isLoading, error } = useApi(fetchBook, { immediate: isEditing });
  const { data: categories, isLoading: isLoadingCategories } = useApi(getCategories, {
    params: REFERENCE_PARAMS
  });
  const { data: authors, isLoading: isLoadingAuthors } = useApi(getAuthors, { params: REFERENCE_PARAMS });

  const handleSubmit = async (values) => {
    if (isEditing) {
      await updateBook(id, values);
      showToast({ type: 'success', message: 'Libro actualizado correctamente' });
      navigate(PATHS.BOOK_DETAIL(id));
      return;
    }

    const created = await createBook(values);
    showToast({ type: 'success', message: 'Libro creado correctamente' });
    navigate(PATHS.BOOK_DETAIL(created.data._id));
  };

  if (isLoading || isLoadingCategories || isLoadingAuthors) {
    return <CenteredSpinner />;
  }

  if (error) {
    return (
      <Alert variant="danger" title="No fue posible cargar el libro">
        {error}
      </Alert>
    );
  }

  return (
    <>
      <PageHeader
        title={isEditing ? 'Editar libro' : 'Nuevo libro'}
        subtitle={
          isEditing
            ? 'Actualice la informacion del libro seleccionado'
            : 'Registre un nuevo libro en el catalogo'
        }
      />

      <Card>
        <BookForm
          initialValues={isEditing && book ? toBookFormValues(book) : EMPTY_BOOK}
          categories={categories ?? []}
          authors={authors ?? []}
          submitLabel={isEditing ? 'Guardar cambios' : 'Crear libro'}
          onSubmit={handleSubmit}
          onCancel={() => navigate(isEditing ? PATHS.BOOK_DETAIL(id) : PATHS.BOOKS)}
        />
      </Card>
    </>
  );
};
