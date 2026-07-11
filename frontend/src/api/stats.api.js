import httpClient from './httpClient.js';

export const getAdminSummary = () => httpClient.get('/stats/summary');

export const getMySummary = () => httpClient.get('/stats/me');
