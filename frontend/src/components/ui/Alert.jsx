import { Icon } from '../icons/Icon.jsx';
import styles from '../../styles/components/ui/Alert.module.css';

const ICON_BY_VARIANT = {
  success: 'check',
  warning: 'alert',
  danger: 'alert',
  info: 'info'
};

export const Alert = ({ variant = 'info', title, children }) => (
  <div className={`${styles.alert} ${styles[variant]}`} role={variant === 'danger' ? 'alert' : 'status'}>
    <Icon name={ICON_BY_VARIANT[variant]} size="md" className={styles.icon} />

    <div className={styles.content}>
      {title ? <span className={styles.title}>{title}</span> : null}
      {children ? <span>{children}</span> : null}
    </div>
  </div>
);
