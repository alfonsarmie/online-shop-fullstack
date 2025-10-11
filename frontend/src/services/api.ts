import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

// Configuración base de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token en x-token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Cambiar de Authorization a x-token
      config.headers['x-token'] = token;
      // Opcional: remover el header Authorization si existe
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;