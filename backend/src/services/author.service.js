import { Author } from '../models/Author.js';
import { Book } from '../models/Book.js';
import { AppError } from '../utils/AppError.js';
import { buildListQuery } from '../utils/queryFeatures.js';

const findAuthorOrFail = async (id) => {
  const author = await Author.findById(id);

  if (!author || !author.isActive) {
    throw new AppError('El autor no existe', 404);
  }

  return author;
};

export const listAuthors = (query) =>
  buildListQuery(Author, query, {
    searchFields: ['name', 'nationality'],
    filters: { isActive: true },
    defaultSort: 'name'
  });

export const getAuthorById = (id) => findAuthorOrFail(id);

export const createAuthor = (payload) => Author.create(payload);

export const updateAuthor = async (id, payload) => {
  const author = await findAuthorOrFail(id);

  Object.assign(author, payload);
  await author.save();

  return author;
};

export const deleteAuthor = async (id) => {
  const author = await findAuthorOrFail(id);
  const booksByAuthor = await Book.countDocuments({ author: id, isActive: true });

  if (booksByAuthor > 0) {
    throw new AppError('No se puede eliminar un autor con libros asociados', 409);
  }

  author.isActive = false;
  await author.save();
};
