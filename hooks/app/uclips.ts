import api from '@/api/axiosInstance';
import { useInfiniteQuery } from '@tanstack/react-query';

export const useGetUclips = (limit: number = 10) => {
  return useInfiniteQuery({
    queryKey: ['uclips'],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await api.get(
        `/api/posts/uclips?page=${pageParam}&limit=${limit}`
      );
      return res;
    },
    getNextPageParam: (lastPage: any) => {
      if (!lastPage) return undefined;
      const nextPage =
        lastPage.page && lastPage.totalPages && lastPage.page < lastPage.totalPages
          ? lastPage.page + 1
          : undefined;
      return nextPage;
    },
    initialPageParam: 1,
  });
};
