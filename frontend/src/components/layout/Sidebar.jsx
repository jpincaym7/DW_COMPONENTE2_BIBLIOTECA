import { NavLink } from 'react-router-dom';

import { PATHS } from '../../routes/paths.js';
import { Icon } from '../icons/Icon.jsx';
import styles from '../../styles/components/layout/Sidebar.module.css';

const GENERAL_LINKS = [
  { to: PATHS.DASHBOARD, label: 'Panel principal', icon: 'dashboard', end: true },
  { to: PATHS.BOOKS, label: 'Catalogo', icon: 'books' },
  { to: PATHS.MY_LOANS, label: 'Mis prestamos', icon: 'clock' }
];

const ADMIN_LINKS = [
  { to: PATHS.ADMIN_LOANS, label: 'Prestamos', icon: 'inbox' },
  { to: PATHS.ADMIN_CATEGORIES, label: 'Categorias', icon: 'tag' },
  { to: PATHS.ADMIN_AUTHORS, label: 'Autores', icon: 'user' },
  { to: PATHS.ADMIN_USERS, label: 'Usuarios', icon: 'users' },
  { to: PATHS.ADMIN_DESIGN_SYSTEM, label: 'Sistema de diseno', icon: 'layers' }
];

const SidebarLink = ({ to, label, icon, end = false, onNavigate }) => (
  <NavLink
    to={to}
    end={end}
    onClick={onNavigate}
    className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`.trim()}
  >
    <Icon name={icon} size="md" />
    {label}
  </NavLink>
);

export const Sidebar = ({ isAdmin, isOpen, onNavigate }) => (
  <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`.trim()}>
    <nav className={styles.section}>
      <p className={styles.sectionTitle}>General</p>
      {GENERAL_LINKS.map((link) => (
        <SidebarLink key={link.to} {...link} onNavigate={onNavigate} />
      ))}
    </nav>

    {isAdmin ? (
      <nav className={styles.section}>
        <p className={styles.sectionTitle}>Administracion</p>
        {ADMIN_LINKS.map((link) => (
          <SidebarLink key={link.to} {...link} onNavigate={onNavigate} />
        ))}
      </nav>
    ) : null}
  </aside>
);
