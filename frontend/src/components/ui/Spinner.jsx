import styles from '../../styles/components/ui/Spinner.module.css';

export const Spinner = ({ size = 'md', label = 'Cargando' }) => (
  <span className={`${styles.spinner} ${styles[size]}`} role="status" aria-label={label} />
);

export const CenteredSpinner = ({ label = 'Cargando' }) => (
  <div className={styles.centered}>
    <Spinner size="lg" label={label} />
  </div>
);
