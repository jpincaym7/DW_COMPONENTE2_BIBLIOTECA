import httpClient from './httpClient.js';

export const getAuthors = (params) => httpClient.get('/authors', { params });

export const createAuthor = (payload) => httpClient.post('/authors', payload);

export const updateAuthor = (id, payload) => httpClient.put(`/authors/${id}`, payload);

export const deleteAuthor = (id) => httpClient.delete(`/authors/${id}`);
