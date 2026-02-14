import api from '@/api/axiosInstance';
import { getShortErrorMessage } from '@/lib/error';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

export const useGetSupportThreads = (limit: number = 20) => {
  return useQuery({
    queryKey: ['support-threads', limit],
    queryFn: async () => {
      const res = await api.get(`/api/support/threads?page=1&limit=${limit}`);
      return res?.data || res;
    },
  });
};

export const useGetSupportMessages = (threadId?: string, limit: number = 50) => {
  return useQuery({
    queryKey: ['support-messages', threadId, limit],
    queryFn: async () => {
      const res = await api.get(
        `/api/support/threads/${threadId}/messages?page=1&limit=${limit}`
      );
      return res?.data || res;
    },
    enabled: Boolean(threadId),
  });
};

export const useSendSupportMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { subject: string; content: string }) => {
      const res = await api.post('/api/support/messages', data);
      return res?.data || res;
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['support-threads'] });
      queryClient.invalidateQueries({ queryKey: ['support-messages'] });
      Toast.show({
        type: 'success',
        text1: 'Message Sent',
        text2: data?.message || 'Your message has been sent to admin.',
      });
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Send Failed',
        text2: getShortErrorMessage(error, 'Could not send support message.'),
      });
    },
  });
};

