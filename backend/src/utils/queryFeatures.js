import { buildPaginationMeta } from './apiResponse.js';

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const buildSearchFilter = (term, searchFields) => {
  if (!term || searchFields.length === 0) {
    return null;
  }

  const pattern = new RegExp(escapeRegex(term), 'i');
  return { $or: searchFields.map((field) => ({ [field]: pattern })) };
};

const removeEmptyValues = (filters) =>
  Object.entries(filters).reduce((accumulator, [key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      accumulator[key] = value;
    }
    return accumulator;
  }, {});

export const buildListQuery = async (
  model,
  { page, limit, q, sort },
  { searchFields = [], filters = {}, populate = [], defaultSort = '-createdAt', select = null } = {}
) => {
  const conditions = removeEmptyValues(filters);
  const searchFilter = buildSearchFilter(q, searchFields);

  const query = searchFilter ? { ...conditions, ...searchFilter } : conditions;
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    model
      .find(query)
      .select(select)
      .populate(populate)
      .sort(sort || defaultSort)
      .skip(skip)
      .limit(limit)
      .lean(),
    model.countDocuments(query)
  ]);

  return { items, meta: buildPaginationMeta({ page, limit, total }) };
};
