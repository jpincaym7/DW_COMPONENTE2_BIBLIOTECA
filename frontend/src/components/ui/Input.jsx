import styles from '../../styles/components/ui/controls.module.css';

export const Input = ({ size = 'md', hasError = false, className = '', ...rest }) => {
  const classNames = [styles.control, styles[size], hasError ? styles.hasError : '', className]
    .filter(Boolean)
    .join(' ');

  return <input className={classNames} aria-invalid={hasError} {...rest} />;
};
