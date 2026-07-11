import httpClient from './httpClient.js';

export const getCategories = (params) => httpClient.get('/categories', { params });

export const createCategory = (payload) => httpClient.post('/categories', payload);

export const updateCategory = (id, payload) => httpClient.put(`/categories/${id}`, payload);

export const deleteCategory = (id) => httpClient.delete(`/categories/${id}`);
