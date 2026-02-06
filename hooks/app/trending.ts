import api from '@/api/axiosInstance';
import { useInfiniteQuery } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

export const useGetTrendingPost = (
  selectedTab: string,
  options?: { enabled?: boolean }
) => {
  return useInfiniteQuery({
    queryKey: ['trendingPost', selectedTab],
    queryFn: async ({ pageParam = 1 }) => {
      try {
        let url = `/api/trending?section=${selectedTab}`;
        if (selectedTab === 'manual') {
          url += `&manualPage=${pageParam}&manualLimit=10`;
        } else if (selectedTab === 'organic') {
          url += `&organicPage=${pageParam}&organicLimit=10`;
        } else if (selectedTab === 'items') {
          url += `&itemsPage=${pageParam}&itemsLimit=10`;
        }
        const res = await api.get(url);
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
    getNextPageParam: (lastPage: any) => {
      const meta = lastPage?.meta || {};
      const key =
        selectedTab === 'manual'
          ? 'manual'
          : selectedTab === 'organic'
            ? 'organic'
            : selectedTab === 'items'
              ? 'items'
              : null;
      if (!key) return undefined;
      const page = meta?.[key]?.page ?? 1;
      const totalPages = meta?.[key]?.totalPages ?? 1;
      return page < totalPages ? page + 1 : undefined;
    },
    enabled: options?.enabled,
    initialPageParam: 1,
  });
};
