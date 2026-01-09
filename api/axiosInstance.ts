import { getAuth } from '@/store/auth.store';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://10.10.11.18:4000',

  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async config => {
    const token = getAuth().user?.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => Promise.reject(error)
);

api.interceptors.response.use(
  response => response.data,
  error => {
    console.log('API Error:', error?.response?.data || error.message);

    if (error.response?.status === 401) {
      console.log('Authentication error - please log in again');
    }

    return Promise.reject(error);
  }
);

export default api;
