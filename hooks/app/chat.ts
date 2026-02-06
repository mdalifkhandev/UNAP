import api from '@/api/axiosInstance';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetAllChatList = () => {
  return useQuery({
    queryKey: ['chatlist'],
    queryFn: async () => {
      const res = await api.get(`/api/chats`);
      return res;
    },
  });
};

export const useGetAllMessages = (userId: string, options?: { limit?: number }) => {
  return useInfiniteQuery({
    queryKey: ['chat', userId, options?.limit ?? 20],
    queryFn: async ({ pageParam = 1 }) => {
      const limit = options?.limit ?? 20;
      const res = await api.get(`/api/chats/${userId}/messages?page=${pageParam}&limit=${limit}`);
      return res;
    },
    getNextPageParam: (lastPage: any) => {
      const page = lastPage?.page ?? 1;
      const totalPages = lastPage?.totalPages ?? 1;
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: !!userId,
  });
};

export const useChattingSendMessage = () => {
  const queryClientInstance = useQueryClient();

  return useMutation({
    mutationFn: async ({ data, userId }: any) => {
      const res = await api.post(`/api/chats/${userId}/messages`, data);
      return res;
    },
    onSuccess: (_, variables) => {
      queryClientInstance.invalidateQueries({ queryKey: ['chat', variables.userId] });
      queryClientInstance.invalidateQueries({ queryKey: ['chatlist'] });
    },
  });
};

export const useMarkMessagesAsRead = () => {
  const queryClientInstance = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const res = await api.post(`/api/chats/${userId}/read`);
      return res;
    },
    onSuccess: (_, userId) => {
      // Invalidate chat list to update unread count
      queryClientInstance.invalidateQueries({ queryKey: ['chatlist'] });
    },
  });
};
