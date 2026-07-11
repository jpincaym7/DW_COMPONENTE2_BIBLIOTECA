import { Outlet } from 'react-router-dom';

import { Icon } from '../components/icons/Icon.jsx';
import styles from '../styles/layouts/AuthLayout.module.css';

export const AuthLayout = () => (
  <div className={styles.layout}>
    <div className={styles.panel}>
      <div className={styles.brand}>
        <Icon name="library" size="lg" />
        <span className={styles.brandName}>Biblioteca</span>
        <span className={styles.tagline}>Sistema de gestion de prestamos</span>
      </div>

      <Outlet />
    </div>
  </div>
);
