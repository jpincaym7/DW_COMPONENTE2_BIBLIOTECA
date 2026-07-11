import httpClient from './httpClient.js';

export const register = (payload) => httpClient.post('/auth/register', payload);

export const login = (credentials) => httpClient.post('/auth/login', credentials);

export const logout = () => httpClient.post('/auth/logout');

export const getProfile = () => httpClient.get('/auth/me');
