import { Icon } from '../icons/Icon.jsx';
import { Input } from './Input.jsx';
import styles from '../../styles/components/ui/SearchInput.module.css';

export const SearchInput = ({ value, onChange, placeholder = 'Buscar', label = 'Buscar' }) => (
  <div className={styles.wrapper}>
    <Icon name="search" size="sm" className={styles.icon} />
    <Input
      type="search"
      className={styles.input}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      aria-label={label}
    />
  </div>
);
