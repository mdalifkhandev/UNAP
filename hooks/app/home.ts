import api from '@/api/axiosInstance';
import { useMutation, useQueries } from '@tanstack/react-query';

export const useGetAllPost = () => {
  return useQueries({
    queries: [
      {
        queryKey: ['post'],
        queryFn: async () => {
          const result = await api.get('/api/feed');
          return result;
        },
      },
    ],
  });
};

export const useUserFollow = () => {
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post('/api/follows', data);
      return res;
    },
  });
};
export const useUserUnFollow = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/api/follows/${id}`);
      return res;
    },
  });
};
