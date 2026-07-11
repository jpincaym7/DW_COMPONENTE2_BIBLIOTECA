import styles from '../../styles/components/ui/Skeleton.module.css';

export const Skeleton = ({ width = '100%', height = 'var(--space-4)' }) => (
  <span className={styles.skeleton} style={{ width, height, display: 'block' }} aria-hidden="true" />
);
