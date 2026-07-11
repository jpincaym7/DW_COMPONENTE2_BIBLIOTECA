import styles from '../../styles/components/ui/FormField.module.css';

export const FormField = ({ label, name, error, hint, required = false, children }) => {
  const errorId = `${name}-error`;
  const hintId = `${name}-hint`;

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={name}>
        {label}
        {required ? <span className={styles.required}>*</span> : null}
      </label>

      {children({
        id: name,
        name,
        hasError: Boolean(error),
        'aria-describedby': error ? errorId : hint ? hintId : undefined
      })}

      {hint && !error ? (
        <span id={hintId} className={styles.hint}>
          {hint}
        </span>
      ) : null}

      {error ? (
        <span id={errorId} className={styles.error} role="alert">
          {error}
        </span>
      ) : null}
    </div>
  );
};
