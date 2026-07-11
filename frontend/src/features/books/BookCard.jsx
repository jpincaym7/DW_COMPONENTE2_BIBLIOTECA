import { Link } from 'react-router-dom';

import { Badge } from '../../components/ui/Badge.jsx';
import { PATHS } from '../../routes/paths.js';
import styles from '../../styles/features/books/BookCard.module.css';
import { BookCover } from './BookCover.jsx';

export const BookCard = ({ book }) => {
  const isAvailable = book.availableCopies > 0;

  return (
    <Link to={PATHS.BOOK_DETAIL(book._id)} className={styles.card}>
      <BookCover url={book.coverUrl} title={book.title} size="md" />

      <div className={styles.body}>
        <h3 className={styles.title}>{book.title}</h3>
        <span className={styles.author}>{book.author?.name}</span>

        <div className={styles.meta}>
          <Badge variant="neutral">{book.category?.name}</Badge>
          <Badge variant={isAvailable ? 'success' : 'danger'}>
            {isAvailable ? `${book.availableCopies} disponibles` : 'Sin ejemplares'}
          </Badge>
        </div>
      </div>
    </Link>
  );
};
