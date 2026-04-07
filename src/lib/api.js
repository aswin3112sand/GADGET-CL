import axios from 'axios';
import { clearAdminSession, getAdminSession } from '../utils/adminSession';

const normalizeBaseUrl = (value) => value?.replace(/\/+$/, '') || '';

const resolveApiBaseUrl = () => {
  const configuredBaseUrl = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL);
  if (configuredBaseUrl) {
    return configuredBaseUrl;
  }

  if (import.meta.env.DEV && typeof window !== 'undefined') {
    return `${window.location.protocol}//${window.location.hostname}:8080`;
  }

  return '/api';
};

const api = axios.create({
  baseURL: resolveApiBaseUrl(),
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const session = getAdminSession();
  if (session?.token) {
    config.headers.Authorization = `${session.tokenType || 'Bearer'} ${session.token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      clearAdminSession();
    }
    return Promise.reject(error);
  },
);

export const apiErrorMessage = (error, fallback = 'Something went wrong. Please try again.') => {
  const firstDetail = Array.isArray(error?.response?.data?.details) && error.response.data.details.length > 0
    ? error.response.data.details[0]
    : null;

  if (typeof firstDetail === 'string' && firstDetail && !/^[A-Z0-9_]+$/.test(firstDetail)) {
    return firstDetail;
  }
  if (Array.isArray(error?.response?.data?.details) && error.response.data.details.length > 0) {
    if (!error?.response?.data?.message) {
      return error.response.data.details[0];
    }
  }
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  if (error?.message) {
    return error.message;
  }
  return fallback;
};

export default api;
