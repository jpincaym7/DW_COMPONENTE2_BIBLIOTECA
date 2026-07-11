import { ROLE_LABELS } from '@biblioteca/shared';

import { Icon } from '../icons/Icon.jsx';
import { Button } from '../ui/Button.jsx';
import { IconButton } from '../ui/IconButton.jsx';
import styles from '../../styles/components/layout/Navbar.module.css';

export const Navbar = ({ user, onLogout, onToggleSidebar }) => (
  <header className={styles.navbar}>
    <div className={styles.brand}>
      <IconButton
        icon="menu"
        label="Abrir menu"
        size="sm"
        className={styles.menuButton}
        onClick={onToggleSidebar}
      />
      <Icon name="library" size="lg" />
      <span>Biblioteca</span>
    </div>

    <div className={styles.session}>
      <div className={styles.identity}>
        <span className={styles.name}>{user.name}</span>
        <span className={styles.role}>{ROLE_LABELS[user.role]}</span>
      </div>

      <Button variant="secondary" size="sm" onClick={onLogout}>
        <Icon name="logout" size="sm" />
        Cerrar sesion
      </Button>
    </div>
  </header>
);
