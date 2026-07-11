import styles from '../../styles/components/layout/PageHeader.module.css';

export const PageHeader = ({ title, subtitle, actions }) => (
  <header className={styles.header}>
    <div className={styles.titles}>
      <h1 className={styles.title}>{title}</h1>
      {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
    </div>

    {actions ? <div className={styles.actions}>{actions}</div> : null}
  </header>
);
