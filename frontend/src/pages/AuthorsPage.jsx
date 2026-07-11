import { useState } from 'react';

import { createAuthor, deleteAuthor, getAuthors, updateAuthor } from '../api/authors.api.js';
import { Icon } from '../components/icons/Icon.jsx';
import { PageHeader } from '../components/layout/PageHeader.jsx';
import { Button } from '../components/ui/Button.jsx';
import { ConfirmDialog } from '../components/ui/ConfirmDialog.jsx';
import { DataTable } from '../components/ui/DataTable.jsx';
import { IconButton } from '../components/ui/IconButton.jsx';
import { Modal } from '../components/ui/Modal.jsx';
import { Pagination } from '../components/ui/Pagination.jsx';
import { SearchInput } from '../components/ui/SearchInput.jsx';
import { AuthorForm, EMPTY_AUTHOR } from '../features/authors/AuthorForm.jsx';
import { useCrudList } from '../hooks/useCrudList.js';
import { useModal } from '../hooks/useModal.js';
import { useToast } from '../hooks/useToast.js';
import styles from '../styles/pages/AdminPage.module.css';

export const AuthorsPage = () => {
  const { showToast } = useToast();
  const formModal = useModal();
  const deleteDialog = useModal();
  const [isDeleting, setIsDeleting] = useState(false);

  const { items, meta, isLoading, error, page, setPage, search, setSearch, refetch } =
    useCrudList(getAuthors);

  const handleSubmit = async (values) => {
    if (formModal.selected) {
      await updateAuthor(formModal.selected._id, values);
      showToast({ type: 'success', message: 'Autor actualizado correctamente' });
    } else {
      await createAuthor(values);
      showToast({ type: 'success', message: 'Autor creado correctamente' });
    }

    formModal.close();
    await refetch();
  };

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      await deleteAuthor(deleteDialog.selected._id);
      showToast({ type: 'success', message: 'Autor eliminado correctamente' });
      await refetch();
    } catch (apiError) {
      showToast({ type: 'danger', message: apiError.message });
    } finally {
      setIsDeleting(false);
      deleteDialog.close();
    }
  };

  const columns = [
    { key: 'name', header: 'Nombre' },
    {
      key: 'nationality',
      header: 'Nacionalidad',
      render: (author) => author.nationality || 'Sin registrar'
    },
    {
      key: 'birthYear',
      header: 'Anio de nacimiento',
      render: (author) => author.birthYear ?? 'Sin registrar'
    },
    {
      key: 'actions',
      header: 'Acciones',
      align: 'right',
      render: (author) => (
        <div className={styles.rowActions}>
          <IconButton icon="edit" label="Editar autor" size="sm" onClick={() => formModal.open(author)} />
          <IconButton
            icon="trash"
            label="Eliminar autor"
            size="sm"
            variant="danger"
            onClick={() => deleteDialog.open(author)}
          />
        </div>
      )
    }
  ];

  return (
    <>
      <PageHeader
        title="Autores"
        subtitle="Administre los autores del catalogo"
        actions={
          <Button onClick={() => formModal.open()}>
            <Icon name="plus" size="sm" />
            Nuevo autor
          </Button>
        }
      />

      <div className={styles.toolbar}>
        <SearchInput
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar autor"
        />
      </div>

      <DataTable
        columns={columns}
        rows={items}
        isLoading={isLoading}
        error={error}
        emptyTitle="No hay autores registrados"
        emptyMessage="Cree el primer autor para poder registrar libros"
        emptyAction={<Button onClick={() => formModal.open()}>Nuevo autor</Button>}
      />

      <Pagination page={page} totalPages={meta?.totalPages} total={meta?.total} onPageChange={setPage} />

      <Modal
        isOpen={formModal.isOpen}
        onClose={formModal.close}
        title={formModal.selected ? 'Editar autor' : 'Nuevo autor'}
      >
        <AuthorForm
          initialValues={
            formModal.selected
              ? {
                  name: formModal.selected.name,
                  nationality: formModal.selected.nationality ?? '',
                  birthYear: formModal.selected.birthYear ?? ''
                }
              : EMPTY_AUTHOR
          }
          submitLabel={formModal.selected ? 'Guardar cambios' : 'Crear autor'}
          onSubmit={handleSubmit}
          onCancel={formModal.close}
        />
      </Modal>

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Eliminar autor"
        message={`Esta seguro de eliminar al autor "${deleteDialog.selected?.name}"?`}
        confirmLabel="Eliminar"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={deleteDialog.close}
      />
    </>
  );
};
