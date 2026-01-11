import api from '@/api/axiosInstance';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await api.post('/api/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return res;
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['post'] });
      Toast.show({
        type: 'success',
        text1: 'Post Created',
        text2: data?.message || 'Your post has been shared successfully.',
      });
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Post Failed',
        text2: error?.response?.data?.message || error.message,
      });
    },
  });
};

export const useSavePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (postId: string) => {
      const res = await api.post('/api/saved-posts', { postId });
      return res;
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['saved-posts'] });
      Toast.show({
        type: 'success',
        text1: 'Post Saved',
        text2: data?.message || 'Your post has been saved successfully.',
      });
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Post Failed',
        text2: error?.response?.data?.message || error.message,
      });
    },
  });
};

export const useUnsavePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (postId: string) => {
      const res = await api.delete(`/api/saved-posts/${postId}`);
      return res;
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['saved-posts'] });
      Toast.show({
        type: 'success',
        text1: 'Post Unsaved',
        text2: data?.message || 'Your post has been unsaved successfully.',
      });
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Post Failed',
        text2: error?.response?.data?.message || error.message,
      });
    },
  });
};

export const useGetAllSavePost = () => {
  return useQuery({
    queryKey: ['saved-posts'],
    queryFn: async () => {
      try {
        const res = await api.get('/api/saved-posts?page=1&limit=5');
        if (res === undefined || res === null) {
          return { posts: [] };
        }
        return res;
      } catch (error: any) {
        console.error('API Error in useGetAllSavePost:', error);
        Toast.show({
          type: 'error',
          text1: 'Fetch Failed',
          text2: 'Could not load saved posts.',
        });
        return { posts: [] };
      }
    },
  });
};
