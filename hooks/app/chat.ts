import api from '@/api/axiosInstance';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useGetAllChatList = () => {
  return useQuery({
    queryKey: ['chatlist'],
    queryFn: async () => {
      const res = await api.get(`/api/chats`);
      return res;
    },
  });
};

export const useChatting = () => {
  return useMutation({
    mutationFn: async ({ data, userId }: any) => {
      const res = await api.post(`/api/chats/${userId}/messages`, data);
      return res;
    },
  });
};
