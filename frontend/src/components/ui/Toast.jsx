import { Icon } from '../icons/Icon.jsx';
import { IconButton } from './IconButton.jsx';
import styles from '../../styles/components/ui/Toast.module.css';

const ICON_BY_TYPE = {
  success: 'check',
  danger: 'alert',
  warning: 'alert',
  info: 'info'
};

export const Toast = ({ type = 'info', message, onDismiss }) => (
  <div className={`${styles.toast} ${styles[type]}`}>
    <Icon name={ICON_BY_TYPE[type]} size="md" className={styles.icon} />
    <span className={styles.message}>{message}</span>
    <IconButton icon="close" label="Cerrar notificacion" size="sm" onClick={onDismiss} />
  </div>
);

export const ToastContainer = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className={styles.container} role="status" aria-live="polite">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          type={toast.type}
          message={toast.message}
          onDismiss={() => onDismiss(toast.id)}
        />
      ))}
    </div>
  );
};
