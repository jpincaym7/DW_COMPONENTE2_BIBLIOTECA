import { useState } from 'react';

import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory
} from '../api/categories.api.js';
import { Icon } from '../components/icons/Icon.jsx';
import { PageHeader } from '../components/layout/PageHeader.jsx';
import { Button } from '../components/ui/Button.jsx';
import { ConfirmDialog } from '../components/ui/ConfirmDialog.jsx';
import { DataTable } from '../components/ui/DataTable.jsx';
import { IconButton } from '../components/ui/IconButton.jsx';
import { Modal } from '../components/ui/Modal.jsx';
import { Pagination } from '../components/ui/Pagination.jsx';
import { SearchInput } from '../components/ui/SearchInput.jsx';
import { CategoryForm, EMPTY_CATEGORY } from '../features/categories/CategoryForm.jsx';
import { useCrudList } from '../hooks/useCrudList.js';
import { useModal } from '../hooks/useModal.js';
import { useToast } from '../hooks/useToast.js';
import styles from '../styles/pages/AdminPage.module.css';

export const CategoriesPage = () => {
  const { showToast } = useToast();
  const formModal = useModal();
  const deleteDialog = useModal();
  const [isDeleting, setIsDeleting] = useState(false);

  const { items, meta, isLoading, error, page, setPage, search, setSearch, refetch } =
    useCrudList(getCategories);

  const handleSubmit = async (values) => {
    if (formModal.selected) {
      await updateCategory(formModal.selected._id, values);
      showToast({ type: 'success', message: 'Categoria actualizada correctamente' });
    } else {
      await createCategory(values);
      showToast({ type: 'success', message: 'Categoria creada correctamente' });
    }

    formModal.close();
    await refetch();
  };

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      await deleteCategory(deleteDialog.selected._id);
      showToast({ type: 'success', message: 'Categoria eliminada correctamente' });
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
      key: 'description',
      header: 'Descripcion',
      render: (category) => category.description || 'Sin descripcion'
    },
    {
      key: 'actions',
      header: 'Acciones',
      align: 'right',
      render: (category) => (
        <div className={styles.rowActions}>
          <IconButton icon="edit" label="Editar categoria" size="sm" onClick={() => formModal.open(category)} />
          <IconButton
            icon="trash"
            label="Eliminar categoria"
            size="sm"
            variant="danger"
            onClick={() => deleteDialog.open(category)}
          />
        </div>
      )
    }
  ];

  return (
    <>
      <PageHeader
        title="Categorias"
        subtitle="Administre las categorias del catalogo"
        actions={
          <Button onClick={() => formModal.open()}>
            <Icon name="plus" size="sm" />
            Nueva categoria
          </Button>
        }
      />

      <div className={styles.toolbar}>
        <SearchInput
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar categoria"
        />
      </div>

      <DataTable
        columns={columns}
        rows={items}
        isLoading={isLoading}
        error={error}
        emptyTitle="No hay categorias registradas"
        emptyMessage="Cree la primera categoria para organizar el catalogo"
        emptyAction={<Button onClick={() => formModal.open()}>Nueva categoria</Button>}
      />

      <Pagination page={page} totalPages={meta?.totalPages} total={meta?.total} onPageChange={setPage} />

      <Modal
        isOpen={formModal.isOpen}
        onClose={formModal.close}
        title={formModal.selected ? 'Editar categoria' : 'Nueva categoria'}
      >
        <CategoryForm
          initialValues={
            formModal.selected
              ? { name: formModal.selected.name, description: formModal.selected.description ?? '' }
              : EMPTY_CATEGORY
          }
          submitLabel={formModal.selected ? 'Guardar cambios' : 'Crear categoria'}
          onSubmit={handleSubmit}
          onCancel={formModal.close}
        />
      </Modal>

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Eliminar categoria"
        message={`Esta seguro de eliminar la categoria "${deleteDialog.selected?.name}"?`}
        confirmLabel="Eliminar"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={deleteDialog.close}
      />
    </>
  );
};
