import httpClient from './httpClient.js';

export const getLoans = (params) => httpClient.get('/loans', { params });

export const getMyLoans = (params) => httpClient.get('/loans/me', { params });

export const getLoanById = (id) => httpClient.get(`/loans/${id}`);

export const createLoan = (payload) => httpClient.post('/loans', payload);

export const returnLoan = (id) => httpClient.patch(`/loans/${id}/return`);

export const deleteLoan = (id) => httpClient.delete(`/loans/${id}`);
