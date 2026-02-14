import useAuthStore, { getAuth } from '@/store/auth.store';
import axios from 'axios';
import { router } from 'expo-router';

const api = axios.create({
  // baseURL: 'http://10.10.11.18:4000',
  // baseURL: 'https://marlene-unlarcenous-nonmunicipally.ngrok-free.dev',
  baseURL: 'https://rurally-unparticular-lilliana.ngrok-free.dev',

  headers: {
    'Content-Type': 'application/json',
  },
});

let isRedirectingToLogin = false;

const getErrorMessage = (err: unknown) => {
  if (!err) return 'Unknown error';
  if (typeof err === 'string') return err;
  if (typeof err === 'object' && 'message' in err) {
    return String((err as { message?: unknown }).message);
  }
  try {
    return JSON.stringify(err);
  } catch {
    return 'Unknown error';
  }
};

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
  async error => {
    console.log('API Error:', error?.response?.data || getErrorMessage(error));

    const originalRequest = error.config || {};
    const status = error.response?.status;
    const isRefreshCall =
      typeof originalRequest?.url === 'string' &&
      originalRequest.url.includes('/api/auth/refresh');

    if (status === 401 && !originalRequest._retry && !isRefreshCall) {
      const authState = getAuth();
      const refreshToken = authState.user?.refreshToken;
      const rememberMe = authState.rememberMe;
      const hasAccessToken = Boolean(authState.user?.token);

      if (!refreshToken || !rememberMe) {
        if (hasAccessToken) {
          useAuthStore.getState().clearAuth();
          if (!isRedirectingToLogin) {
            isRedirectingToLogin = true;
            router.replace('/(auth)/login');
            setTimeout(() => {
              isRedirectingToLogin = false;
            }, 1000);
          }
        }
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const refreshClient = axios.create({
          baseURL: api.defaults.baseURL,
          headers: { 'Content-Type': 'application/json' },
        });
        const res = await refreshClient.post('/api/auth/refresh', {
          refreshToken,
        });
        const data = res?.data || {};
        const newToken = data?.token;
        const newRefresh = data?.refreshToken || refreshToken;
        const user = data?.user;

        if (newToken) {
          const current = getAuth().user;
          const mergedUser = {
            ...(current || {}),
            ...(user || {}),
            token: newToken,
            refreshToken: newRefresh,
          };
          useAuthStore.getState().setUser(mergedUser as any);
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshErr) {
        console.log('Refresh token failed:', getErrorMessage(refreshErr));
      }

      useAuthStore.getState().clearAuth();
      if (!isRedirectingToLogin) {
        isRedirectingToLogin = true;
        router.replace('/(auth)/login');
        setTimeout(() => {
          isRedirectingToLogin = false;
        }, 1000);
      }
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default api;
