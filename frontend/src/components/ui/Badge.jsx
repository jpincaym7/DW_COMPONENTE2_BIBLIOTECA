import styles from '../../styles/components/ui/Badge.module.css';

export const Badge = ({ variant = 'neutral', className = '', children }) => (
  <span className={`${styles.badge} ${styles[variant]} ${className}`.trim()}>{children}</span>
);
