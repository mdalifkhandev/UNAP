import api from '@/api/axiosInstance';
import { useQuery } from '@tanstack/react-query';

export const useGetMyProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await api.get(`/api/profile/me`);
      return res;
    },
  });
};
