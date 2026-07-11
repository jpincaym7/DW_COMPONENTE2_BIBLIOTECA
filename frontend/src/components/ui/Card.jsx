import styles from '../../styles/components/ui/Card.module.css';

export const Card = ({ title, actions, footer, className = '', children }) => (
  <section className={`${styles.card} ${className}`.trim()}>
    {title ? (
      <header className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        {actions}
      </header>
    ) : null}

    <div className={styles.body}>{children}</div>

    {footer ? <footer className={styles.footer}>{footer}</footer> : null}
  </section>
);
