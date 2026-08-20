import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to attach JWT token from localStorage to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('ykstore_user')
      ? JSON.parse(localStorage.getItem('ykstore_user'))
      : null;

    if (userInfo && userInfo.token) {
      config.headers.Authorization = `Bearer ${userInfo.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to handle global 401 unauthorized errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      if (localStorage.getItem('ykstore_user')) {
        localStorage.removeItem('ykstore_user');
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
