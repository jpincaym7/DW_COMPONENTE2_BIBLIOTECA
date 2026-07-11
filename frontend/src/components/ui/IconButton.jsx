import { Icon } from '../icons/Icon.jsx';
import styles from '../../styles/components/ui/IconButton.module.css';

export const IconButton = ({
  icon,
  label,
  variant = 'ghost',
  size = 'md',
  type = 'button',
  disabled = false,
  className = '',
  ...rest
}) => {
  const classNames = [styles.iconButton, styles[variant], styles[size], className]
    .filter(Boolean)
    .join(' ');

  return (
    <button type={type} className={classNames} disabled={disabled} aria-label={label} title={label} {...rest}>
      <Icon name={icon} size={size === 'lg' ? 'lg' : 'md'} />
    </button>
  );
};
