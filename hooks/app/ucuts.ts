import api from '@/api/axiosInstance';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

type CreateUCutsPayload = {
  text: string;
  media: {
    uri: string;
    name: string;
    type: string;
  };
};

export const useCreateUCuts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateUCutsPayload) => {
      const formData = new FormData();
      formData.append('text', payload.text);
      // @ts-ignore - React Native file object
      formData.append('media', payload.media);

      const res = await api.post('/api/ucuts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return res;
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['ucuts'] });
      queryClient.invalidateQueries({ queryKey: ['ucuts-feed'] });
      Toast.show({
        type: 'success',
        text1: 'UCuts Created',
        text2: data?.message || 'Your UCuts has been shared successfully.',
      });
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'UCuts Failed',
        text2: error?.response?.data?.message || error.message,
      });
    },
  });
};

export const useGetUCutsFeed = () => {
  return useQuery({
    queryKey: ['ucuts-feed'],
    queryFn: async () => {
      try {
        const res = await api.get('/api/ucuts/feed');
        const data = res?.data || res;
        if (!data || !data.ucuts) {
          return { ucuts: [], page: 1, totalPages: 1, totalCount: 0 };
        }
        return data;
      } catch (error: any) {
        Toast.show({
          type: 'error',
          text1: 'Fetch Failed',
          text2: error?.response?.data?.message || error.message,
        });
        return { ucuts: [], page: 1, totalPages: 1, totalCount: 0 };
      }
    },
  });
};
