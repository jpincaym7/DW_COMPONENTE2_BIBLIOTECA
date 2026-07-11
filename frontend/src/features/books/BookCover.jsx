import { useEffect, useState } from 'react';

import { Icon } from '../../components/icons/Icon.jsx';
import styles from '../../styles/features/books/BookCover.module.css';

export const BookCover = ({ url, title, size = 'md', onError }) => {
  const [hasFailed, setHasFailed] = useState(false);

  useEffect(() => {
    setHasFailed(false);
  }, [url]);

  const handleError = () => {
    setHasFailed(true);
    onError?.();
  };

  const showsPlaceholder = !url || hasFailed;

  return (
    <div className={`${styles.cover} ${styles[size]}`}>
      {showsPlaceholder ? (
        <Icon name="book" size="lg" />
      ) : (
        <img
          src={url}
          alt={`Portada de ${title}`}
          className={styles.image}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={handleError}
        />
      )}
    </div>
  );
};
