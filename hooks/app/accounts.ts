import api from '@/api/axiosInstance';
import { getShortErrorMessage } from '@/lib/error';
import { useMutation, useQuery } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

export const useGetAccounts = () => {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      const res = await api.get('/api/accounts');
      return res?.data || res;
    },
  });
};

export const useConnectAccount = () => {
  return useMutation({
    mutationFn: async ({
      platform,
      appRedirectUri,
    }: {
      platform: string;
      appRedirectUri?: string;
    }) => {
      const res = await api.post('/api/accounts/connect-late', {
        platform,
        appRedirectUri,
      });
      return res?.data || res;
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Connection Failed',
        text2: getShortErrorMessage(error, 'Please try again.'),
      });
    },
  });
};

export const useDisconnectAccount = () => {
  return useMutation({
    mutationFn: async (platform: string) => {
      const res = await api.delete(`/api/accounts/${platform}`);
      return res?.data || res;
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Disconnect Failed',
        text2: getShortErrorMessage(error, 'Please try again.'),
      });
    },
  });
};
