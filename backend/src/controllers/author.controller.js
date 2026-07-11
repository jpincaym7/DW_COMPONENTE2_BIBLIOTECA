import * as authorService from '../services/author.service.js';
import { sendCreated, sendSuccess } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getAuthors = asyncHandler(async (req, res) => {
  const { items, meta } = await authorService.listAuthors(req.validatedQuery);

  return sendSuccess(res, { message: 'Autores obtenidos correctamente', data: items, meta });
});

export const getAuthor = asyncHandler(async (req, res) => {
  const author = await authorService.getAuthorById(req.params.id);

  return sendSuccess(res, { message: 'Autor obtenido correctamente', data: author });
});

export const postAuthor = asyncHandler(async (req, res) => {
  const author = await authorService.createAuthor(req.body);

  return sendCreated(res, { message: 'Autor creado correctamente', data: author });
});

export const putAuthor = asyncHandler(async (req, res) => {
  const author = await authorService.updateAuthor(req.params.id, req.body);

  return sendSuccess(res, { message: 'Autor actualizado correctamente', data: author });
});

export const removeAuthor = asyncHandler(async (req, res) => {
  await authorService.deleteAuthor(req.params.id);

  return sendSuccess(res, { message: 'Autor eliminado correctamente' });
});
