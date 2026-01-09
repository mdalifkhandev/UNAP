import api from '@/api/axiosInstance';
import { useQueries } from '@tanstack/react-query';

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
