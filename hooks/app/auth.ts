import api from "@/api/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export const useUserRegister = () => {
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post("/api/auth/register", data);
      return res;
    },
  });
};

export const useUserRegisterOtp = () => {
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post("/api/auth/verify-otp", data);
      return res;
    },
  });
};

export const useUserLogin = () => {
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post("/api/auth/login", data);
      return res;
    },
  });
};
