import styles from '../../styles/components/ui/Checkbox.module.css';

export const Checkbox = ({ label, disabled = false, className = '', ...rest }) => {
  const classNames = [styles.wrapper, disabled ? styles.disabled : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <label className={classNames}>
      <input type="checkbox" className={styles.input} disabled={disabled} {...rest} />
      {label}
    </label>
  );
};
