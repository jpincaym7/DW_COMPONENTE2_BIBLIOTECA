import { LOAN_STATUS } from '@biblioteca/shared';

import { Author } from '../models/Author.js';
import { Book } from '../models/Book.js';
import { Category } from '../models/Category.js';
import { Loan } from '../models/Loan.js';
import { AppError } from '../utils/AppError.js';
import { buildListQuery } from '../utils/queryFeatures.js';

const BOOK_POPULATE = [
  { path: 'author', select: 'name nationality' },
  { path: 'category', select: 'name' }
];

const assertRelationsExist = async ({ author, category }) => {
  if (author) {
    const exists = await Author.exists({ _id: author, isActive: true });

    if (!exists) {
      throw new AppError('El autor seleccionado no existe', 404, [
        { field: 'author', message: 'El autor seleccionado no existe' }
      ]);
    }
  }

  if (category) {
    const exists = await Category.exists({ _id: category, isActive: true });

    if (!exists) {
      throw new AppError('La categoria seleccionada no existe', 404, [
        { field: 'category', message: 'La categoria seleccionada no existe' }
      ]);
    }
  }
};

const findBookOrFail = async (id) => {
  const book = await Book.findById(id).populate(BOOK_POPULATE);

  if (!book || !book.isActive) {
    throw new AppError('El libro no existe', 404);
  }

  return book;
};

const buildBookFilters = ({ category, author, available }) => {
  const filters = { isActive: true, category, author };

  if (available) {
    filters.availableCopies = { $gt: 0 };
  }

  return filters;
};

export const listBooks = (query) =>
  buildListQuery(Book, query, {
    searchFields: ['title', 'isbn', 'publisher'],
    filters: buildBookFilters(query),
    populate: BOOK_POPULATE,
    defaultSort: 'title'
  });

export const getBookById = (id) => findBookOrFail(id);

export const createBook = async (payload) => {
  await assertRelationsExist(payload);

  const book = await Book.create({ ...payload, availableCopies: payload.totalCopies });

  return book.populate(BOOK_POPULATE);
};

const calculateAvailableCopies = (book, nextTotalCopies) => {
  const loanedCopies = book.totalCopies - book.availableCopies;

  if (nextTotalCopies < loanedCopies) {
    throw new AppError(
      `No puede reducir los ejemplares por debajo de los ${loanedCopies} prestados actualmente`,
      409,
      [{ field: 'totalCopies', message: `Existen ${loanedCopies} ejemplares prestados` }]
    );
  }

  return nextTotalCopies - loanedCopies;
};

export const updateBook = async (id, payload) => {
  await assertRelationsExist(payload);

  const book = await findBookOrFail(id);

  if (payload.totalCopies !== undefined) {
    book.availableCopies = calculateAvailableCopies(book, payload.totalCopies);
  }

  Object.assign(book, payload);
  await book.save();

  return book.populate(BOOK_POPULATE);
};

export const deleteBook = async (id) => {
  const book = await findBookOrFail(id);
  const activeLoans = await Loan.countDocuments({ book: id, status: LOAN_STATUS.ACTIVE });

  if (activeLoans > 0) {
    throw new AppError('No se puede eliminar un libro con prestamos activos', 409);
  }

  book.isActive = false;
  await book.save();
};
