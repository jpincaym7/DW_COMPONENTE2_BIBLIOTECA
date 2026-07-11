import { getAdminSummary, getMySummary } from '../api/stats.api.js';
import { Icon } from '../components/icons/Icon.jsx';
import { PageHeader } from '../components/layout/PageHeader.jsx';
import { Alert } from '../components/ui/Alert.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Card } from '../components/ui/Card.jsx';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import { CenteredSpinner } from '../components/ui/Spinner.jsx';
import { useApi } from '../hooks/useApi.js';
import { useAuth } from '../hooks/useAuth.js';
import styles from '../styles/pages/DashboardPage.module.css';

const StatCard = ({ icon, variant, value, label }) => (
  <article className={styles.stat}>
    <div className={`${styles.statIcon} ${styles[variant]}`}>
      <Icon name={icon} size="lg" />
    </div>

    <div className={styles.statBody}>
      <span className={styles.statValue}>{value}</span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  </article>
);

const AdminDashboard = ({ summary }) => (
  <>
    <div className={styles.grid}>
      <StatCard icon="books" variant="info" value={summary.totalBooks} label="Libros en catalogo" />
      <StatCard icon="users" variant="success" value={summary.totalUsers} label="Usuarios activos" />
      <StatCard icon="clock" variant="warning" value={summary.activeLoans} label="Prestamos activos" />
      <StatCard icon="alert" variant="danger" value={summary.overdueLoans} label="Prestamos vencidos" />
    </div>

    <Card title="Categorias con mas libros">
      {summary.topCategories.length === 0 ? (
        <EmptyState
          icon="tag"
          title="Sin categorias"
          message="Registre libros para ver la distribucion por categoria"
        />
      ) : (
        <div className={styles.categoryList}>
          {summary.topCategories.map((category) => (
            <div key={category.name} className={styles.categoryItem}>
              <span className={styles.categoryName}>{category.name}</span>
              <Badge variant="neutral">{category.total} libros</Badge>
            </div>
          ))}
        </div>
      )}
    </Card>
  </>
);

const UserDashboard = ({ summary }) => (
  <div className={styles.grid}>
    <StatCard icon="clock" variant="info" value={summary.activeLoans} label="Prestamos activos" />
    <StatCard icon="alert" variant="danger" value={summary.overdueLoans} label="Prestamos vencidos" />
    <StatCard icon="check" variant="success" value={summary.returnedLoans} label="Libros devueltos" />
    <StatCard icon="books" variant="warning" value={summary.availableBooks} label="Libros disponibles" />
  </div>
);

export const DashboardPage = () => {
  const { user, isAdmin } = useAuth();
  const { data: summary, isLoading, error } = useApi(isAdmin ? getAdminSummary : getMySummary);

  if (isLoading) {
    return <CenteredSpinner />;
  }

  if (error) {
    return (
      <Alert variant="danger" title="No fue posible cargar el resumen">
        {error}
      </Alert>
    );
  }

  if (!summary) {
    return null;
  }

  return (
    <>
      <PageHeader
        title={`Bienvenido, ${user.name}`}
        subtitle={
          isAdmin
            ? 'Resumen general de la actividad de la biblioteca'
            : 'Resumen de su actividad en la biblioteca'
        }
      />

      {isAdmin ? <AdminDashboard summary={summary} /> : <UserDashboard summary={summary} />}
    </>
  );
};
