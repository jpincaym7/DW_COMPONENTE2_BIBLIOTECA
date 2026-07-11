import { useState } from 'react';
import { ROLE_LABELS, ROLE_VALUES } from '@biblioteca/shared';

import { getUsers, updateUserRole, updateUserStatus } from '../api/users.api.js';
import { PageHeader } from '../components/layout/PageHeader.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Button } from '../components/ui/Button.jsx';
import { DataTable } from '../components/ui/DataTable.jsx';
import { Pagination } from '../components/ui/Pagination.jsx';
import { SearchInput } from '../components/ui/SearchInput.jsx';
import { Select } from '../components/ui/Select.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { useCrudList } from '../hooks/useCrudList.js';
import { useToast } from '../hooks/useToast.js';
import { formatDate } from '../utils/formatDate.js';
import styles from '../styles/pages/AdminPage.module.css';

const INITIAL_FILTERS = { role: '' };

const ROLE_OPTIONS = ROLE_VALUES.map((role) => ({ value: role, label: ROLE_LABELS[role] }));

export const UsersPage = () => {
  const { user: currentUser } = useAuth();
  const { showToast } = useToast();
  const [updatingId, setUpdatingId] = useState(null);

  const { items, meta, isLoading, error, page, setPage, search, setSearch, filters, updateFilter, refetch } =
    useCrudList(getUsers, { initialFilters: INITIAL_FILTERS });

  const runUpdate = async (id, action, successMessage) => {
    setUpdatingId(id);

    try {
      await action();
      showToast({ type: 'success', message: successMessage });
      await refetch();
    } catch (apiError) {
      showToast({ type: 'danger', message: apiError.message });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRoleChange = (user, role) =>
    runUpdate(user._id, () => updateUserRole(user._id, role), 'Rol actualizado correctamente');

  const handleStatusChange = (user) =>
    runUpdate(
      user._id,
      () => updateUserStatus(user._id, !user.isActive),
      user.isActive ? 'Usuario desactivado' : 'Usuario activado'
    );

  const columns = [
    { key: 'name', header: 'Nombre' },
    { key: 'email', header: 'Correo' },
    { key: 'createdAt', header: 'Registrado el', render: (user) => formatDate(user.createdAt) },
    {
      key: 'role',
      header: 'Rol',
      render: (user) =>
        user._id === currentUser._id ? (
          <Badge variant="info">{ROLE_LABELS[user.role]}</Badge>
        ) : (
          <Select
            size="sm"
            placeholder="Seleccione un rol"
            aria-label={`Rol de ${user.name}`}
            value={user.role}
            disabled={updatingId === user._id}
            onChange={(event) => handleRoleChange(user, event.target.value)}
            options={ROLE_OPTIONS}
          />
        )
    },
    {
      key: 'status',
      header: 'Estado',
      align: 'center',
      render: (user) => (
        <Badge variant={user.isActive ? 'success' : 'neutral'}>
          {user.isActive ? 'Activo' : 'Inactivo'}
        </Badge>
      )
    },
    {
      key: 'actions',
      header: 'Acciones',
      align: 'right',
      render: (user) =>
        user._id === currentUser._id ? null : (
          <Button
            variant={user.isActive ? 'secondary' : 'primary'}
            size="sm"
            isLoading={updatingId === user._id}
            onClick={() => handleStatusChange(user)}
          >
            {user.isActive ? 'Desactivar' : 'Activar'}
          </Button>
        )
    }
  ];

  return (
    <>
      <PageHeader title="Usuarios" subtitle="Administre los roles y el acceso de los usuarios" />

      <div className={styles.toolbar}>
        <SearchInput
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar por nombre o correo"
        />

        <Select
          placeholder="Todos los roles"
          aria-label="Filtrar por rol"
          value={filters.role ?? ''}
          onChange={(event) => updateFilter('role', event.target.value)}
          options={ROLE_OPTIONS}
        />
      </div>

      <DataTable
        columns={columns}
        rows={items}
        isLoading={isLoading}
        error={error}
        emptyTitle="No hay usuarios registrados"
        emptyMessage="Los usuarios que se registren en el sistema apareceran en esta tabla"
      />

      <Pagination page={page} totalPages={meta?.totalPages} total={meta?.total} onPageChange={setPage} />
    </>
  );
};
