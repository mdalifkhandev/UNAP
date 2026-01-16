import api from '@/api/axiosInstance';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetAllChatList = () => {
  return useQuery({
    queryKey: ['chatlist'],
    queryFn: async () => {
      const res = await api.get(`/api/chats`);
      return res;
    },
  });
};

export const useGetAllMessages=(userId:string)=>{
  return useQuery({
    queryKey:['chat', userId],
    queryFn:async()=>{
      const res=await api.get(`/api/chats/${userId}/messages?page=1&limit=10`);
      return res;
    },
    enabled: !!userId,
  })
}

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
