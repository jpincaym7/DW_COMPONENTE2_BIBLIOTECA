import styles from '../../styles/components/ui/controls.module.css';

export const Select = ({
  options = [],
  placeholder = 'Seleccione una opcion',
  size = 'md',
  hasError = false,
  className = '',
  ...rest
}) => {
  const classNames = [
    styles.control,
    styles.select,
    styles[size],
    hasError ? styles.hasError : '',
    className
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <select className={classNames} aria-invalid={hasError} {...rest}>
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
