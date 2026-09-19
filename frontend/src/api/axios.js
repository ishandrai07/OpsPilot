import axios from 'axios';

// Resolve base URL: uses VITE_API_URL if configured in production, or fallback to relative '/api'
const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) {
    const url = import.meta.env.VITE_API_URL.replace(/\/$/, '');
    return url.endsWith('/api') ? url : `${url}/api`;
  }
  return '/api';
};

const API = axios.create({
  baseURL: getBaseURL(),
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('opspilot_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally (token expired)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('opspilot_token');
      localStorage.removeItem('opspilot_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;
