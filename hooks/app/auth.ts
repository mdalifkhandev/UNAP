import api from '@/api/axiosInstance';
import { useMutation } from '@tanstack/react-query';

export const useUserRegister = () => {
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post('/api/auth/register', data);
      return res;
    },
  });
};

export const useUserRegisterOtp = () => {
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post('/api/auth/verify-otp', data);
      return res;
    },
  });
};

export const useUserLogin = () => {
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post('/api/auth/login', data);
      return res;
    },
  });
};

export const useUserForgatePasswordSendMail = () => {
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post('/api/auth/forgot-password', data);
      return res;
    },
  });
};

export const useUserForgatePasswordVerifyOtp = () => {
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post('/api/auth/verify-reset-otp', data);
      return res;
    },
  });
};

export const useUserForgatePasswordResetPassword = () => {
  return useMutation({
    mutationFn: async ({ data, token }: any) => {
      const res = await api.post('/api/auth/reset-password', data, {
        headers: {
          'x-reset-token': token,
        },
      });
      return res;
    },
  });
};
