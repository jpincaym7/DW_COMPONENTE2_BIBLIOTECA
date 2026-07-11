import styles from '../../styles/features/design-system/DesignSystem.module.css';

export const DesignSection = ({ id, title, description, children }) => (
  <section id={id} className={styles.section}>
    <header className={styles.sectionHeader}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      {description ? <p className={styles.sectionDescription}>{description}</p> : null}
    </header>

    {children}
  </section>
);

export const DesignGroup = ({ title, children }) => (
  <div className={styles.group}>
    {title ? <h3 className={styles.groupTitle}>{title}</h3> : null}
    {children}
  </div>
);

export const DesignRow = ({ children }) => <div className={styles.row}>{children}</div>;

export const DesignStack = ({ children }) => <div className={styles.stack}>{children}</div>;
