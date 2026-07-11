import httpClient from './httpClient.js';

export const getUsers = (params) => httpClient.get('/users', { params });

export const updateUserRole = (id, role) => httpClient.patch(`/users/${id}/role`, { role });

export const updateUserStatus = (id, isActive) => httpClient.patch(`/users/${id}/status`, { isActive });
