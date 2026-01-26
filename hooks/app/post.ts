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
      queryClient.invalidateQueries({ queryKey: ['posts'] });
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

export const useGetMyPosts = () => {
  return useQuery({
    queryKey: ['myPosts'],
    queryFn: async () => {
      try {
        const res = await api.get('/api/posts/mine');
        // Handle Axios response properly
        const data = res?.data || res;
        if (data === undefined || data === null) {
          return { posts: [] };
        }
        return data;
      } catch (error: any) {
        console.warn('API Error in useGetMyPosts:', error);
        Toast.show({
          type: 'error',
          text1: 'Fetch Failed',
          text2: 'Could not load your posts.',
        });
        return { posts: [] };
      }
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (postId: string) => {
      const res = await api.delete(`/api/posts/${postId}`);
      return res;
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['myProfile'] });
      Toast.show({
        type: 'success',
        text1: 'Post Deleted',
        text2: data?.message || 'Your post has been deleted successfully.',
      });
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Delete Failed',
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

export const useGetScheduledPosts = () => {
  return useQuery({
    queryKey: ['scheduled-posts'],
    queryFn: async () => {
      try {
        const res = await api.get('/api/posts/scheduled');
        // Handle Axios response properly
        const data = res?.data || res;
        if (data === undefined || data === null) {
          return { posts: [] };
        }
        return data;
      } catch (error: any) {
        console.error('API Error in useGetScheduledPosts:', error);
        Toast.show({
          type: 'error',
          text1: 'Fetch Failed',
          text2: 'Could not load scheduled posts.',
        });
        return { posts: [] };
      }
    },
  });
};

export const useUpdateScheduledPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      postId,
      formData,
    }: {
      postId: string;
      formData: FormData;
    }) => {
      const res = await api.patch(`/api/posts/${postId}/scheduled`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return res;
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['scheduled-posts'] });
      Toast.show({
        type: 'success',
        text1: 'Post Updated',
        text2: data?.message || 'Your scheduled post has been updated.',
      });
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: error?.response?.data?.message || error.message,
      });
    },
  });
};

export const useCancelScheduledPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (postId: string) => {
      const res = await api.post(`/api/posts/${postId}/cancel`);
      return res;
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['scheduled-posts'] });
      Toast.show({
        type: 'success',
        text1: 'Post Cancelled',
        text2: data?.message || 'Your scheduled post has been cancelled.',
      });
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Cancel Failed',
        text2: error?.response?.data?.message || error.message,
      });
    },
  });
};
