import { Spinner } from './Spinner.jsx';
import styles from '../../styles/components/ui/Button.module.css';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  isLoading = false,
  disabled = false,
  fullWidth = false,
  className = '',
  ...rest
}) => {
  const classNames = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : '',
    className
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button type={type} className={classNames} disabled={disabled || isLoading} {...rest}>
      {isLoading ? <Spinner size="sm" /> : children}
    </button>
  );
};
