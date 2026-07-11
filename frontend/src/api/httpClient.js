import axios from 'axios';

import { normalizeApiError } from '../utils/errorMessage.js';

export const UNAUTHORIZED_EVENT = 'auth:unauthorized';

const PUBLIC_ENDPOINTS = ['/auth/login', '/auth/register'];

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
});

const isPublicEndpoint = (url = '') => PUBLIC_ENDPOINTS.some((endpoint) => url.includes(endpoint));

httpClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const normalized = normalizeApiError(error);

    if (normalized.status === 401 && !isPublicEndpoint(error.config?.url)) {
      window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
    }

    return Promise.reject(normalized);
  }
);

export default httpClient;
