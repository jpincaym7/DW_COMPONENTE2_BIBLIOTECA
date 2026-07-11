import { Book } from '../models/Book.js';
import { Category } from '../models/Category.js';
import { AppError } from '../utils/AppError.js';
import { buildListQuery } from '../utils/queryFeatures.js';

const findCategoryOrFail = async (id) => {
  const category = await Category.findById(id);

  if (!category || !category.isActive) {
    throw new AppError('La categoria no existe', 404);
  }

  return category;
};

export const listCategories = (query) =>
  buildListQuery(Category, query, {
    searchFields: ['name', 'description'],
    filters: { isActive: true },
    defaultSort: 'name'
  });

export const getCategoryById = (id) => findCategoryOrFail(id);

export const createCategory = (payload) => Category.create(payload);

export const updateCategory = async (id, payload) => {
  const category = await findCategoryOrFail(id);

  Object.assign(category, payload);
  await category.save();

  return category;
};

export const deleteCategory = async (id) => {
  const category = await findCategoryOrFail(id);
  const booksInCategory = await Book.countDocuments({ category: id, isActive: true });

  if (booksInCategory > 0) {
    throw new AppError('No se puede eliminar una categoria con libros asociados', 409);
  }

  category.isActive = false;
  await category.save();
};
