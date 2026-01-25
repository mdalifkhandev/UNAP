import api from '@/api/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

export const useGetTrendingPost = (selectedTab: string) => {
  return useQuery({
    queryKey: ['trendingPost', selectedTab],
    queryFn: async () => {
      try {
        const res = await api.get(`/api/trending?section=${selectedTab}`);
        const data = res?.data || res;
        if (data === undefined || data === null) {
          return { [selectedTab]: [] };
        }
        return data;
      } catch (error: any) {
        console.error('API Error in useGetTrendingPost:', error);
        Toast.show({
          type: 'error',
          text1: 'Fetch Failed',
          text2: 'Could not load trending posts.',
        });
        return { [selectedTab]: [] };
      }
    },
  });
};
