import httpClient from './httpClient.js';

export const getBooks = (params) => httpClient.get('/books', { params });

export const getBookById = (id) => httpClient.get(`/books/${id}`);

export const createBook = (payload) => httpClient.post('/books', payload);

export const updateBook = (id, payload) => httpClient.put(`/books/${id}`, payload);

export const deleteBook = (id) => httpClient.delete(`/books/${id}`);
