import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

// Create an Axios instance with the base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add the token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Change 'Authorization' to 'x-token'
      config.headers['x-token'] = token;
      // Optional: remove the Authorization header if it exists
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;