import styles from '../../styles/components/ui/controls.module.css';

export const Textarea = ({ rows = 4, hasError = false, className = '', ...rest }) => {
  const classNames = [
    styles.control,
    styles.textarea,
    styles.md,
    hasError ? styles.hasError : '',
    className
  ]
    .filter(Boolean)
    .join(' ');

  return <textarea className={classNames} rows={rows} aria-invalid={hasError} {...rest} />;
};
