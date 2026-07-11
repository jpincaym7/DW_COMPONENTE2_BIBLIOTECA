import { Icon } from '../icons/Icon.jsx';
import styles from '../../styles/components/ui/EmptyState.module.css';

export const EmptyState = ({ icon = 'inbox', title, message, action }) => (
  <div className={styles.emptyState}>
    <Icon name={icon} size="lg" className={styles.icon} />
    <span className={styles.title}>{title}</span>
    {message ? <p className={styles.message}>{message}</p> : null}
    {action ? <div className={styles.action}>{action}</div> : null}
  </div>
);
