import * as bookService from '../services/book.service.js';
import { sendCreated, sendSuccess } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getBooks = asyncHandler(async (req, res) => {
  const { items, meta } = await bookService.listBooks(req.validatedQuery);

  return sendSuccess(res, { message: 'Libros obtenidos correctamente', data: items, meta });
});

export const getBook = asyncHandler(async (req, res) => {
  const book = await bookService.getBookById(req.params.id);

  return sendSuccess(res, { message: 'Libro obtenido correctamente', data: book });
});

export const postBook = asyncHandler(async (req, res) => {
  const book = await bookService.createBook(req.body);

  return sendCreated(res, { message: 'Libro creado correctamente', data: book });
});

export const putBook = asyncHandler(async (req, res) => {
  const book = await bookService.updateBook(req.params.id, req.body);

  return sendSuccess(res, { message: 'Libro actualizado correctamente', data: book });
});

export const removeBook = asyncHandler(async (req, res) => {
  await bookService.deleteBook(req.params.id);

  return sendSuccess(res, { message: 'Libro eliminado correctamente' });
});
