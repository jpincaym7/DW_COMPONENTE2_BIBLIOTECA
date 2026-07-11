import * as categoryService from '../services/category.service.js';
import { sendCreated, sendSuccess } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getCategories = asyncHandler(async (req, res) => {
  const { items, meta } = await categoryService.listCategories(req.validatedQuery);

  return sendSuccess(res, {
    message: 'Categorias obtenidas correctamente',
    data: items,
    meta
  });
});

export const getCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.getCategoryById(req.params.id);

  return sendSuccess(res, { message: 'Categoria obtenida correctamente', data: category });
});

export const postCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.createCategory(req.body);

  return sendCreated(res, { message: 'Categoria creada correctamente', data: category });
});

export const putCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.updateCategory(req.params.id, req.body);

  return sendSuccess(res, { message: 'Categoria actualizada correctamente', data: category });
});

export const removeCategory = asyncHandler(async (req, res) => {
  await categoryService.deleteCategory(req.params.id);

  return sendSuccess(res, { message: 'Categoria eliminada correctamente' });
});
