import { useEffect } from 'react';
import { createPortal } from 'react-dom';

import { IconButton } from './IconButton.jsx';
import styles from '../../styles/components/ui/Modal.module.css';

export const Modal = ({ isOpen, onClose, title, footer, size = 'md', children }) => {
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const modalClassNames = [styles.modal, size === 'lg' ? styles.wide : ''].filter(Boolean).join(' ');

  return createPortal(
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={modalClassNames} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <header className={styles.header}>
          <h2 id="modal-title" className={styles.title}>
            {title}
          </h2>
          <IconButton icon="close" label="Cerrar" size="sm" onClick={onClose} />
        </header>

        <div className={styles.body}>{children}</div>

        {footer ? <footer className={styles.footer}>{footer}</footer> : null}
      </div>
    </div>,
    document.body
  );
};
