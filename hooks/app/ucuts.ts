import api from '@/api/axiosInstance';
import { getShortErrorMessage } from '@/lib/error';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

type CreateUCutsPayload = {
  text?: string;
  media?: {
    uri: string;
    name: string;
    type: string;
  };
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'audio';
};

export const useCreateUCuts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateUCutsPayload) => {
      if (payload.media) {
        const formData = new FormData();
        if (payload.text) formData.append('text', payload.text);
        // @ts-ignore - React Native file object
        formData.append('media', payload.media);

        const res = await api.post('/api/ucuts', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return res;
      }

      const body: any = {};
      if (payload.text) body.text = payload.text;
      if (payload.mediaUrl) body.mediaUrl = payload.mediaUrl;
      if (payload.mediaType) body.mediaType = payload.mediaType;
      const res = await api.post('/api/ucuts', body);
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
        text2: getShortErrorMessage(error, 'Request failed.'),
      });
    },
  });
};

export const useGetUCutsFeed = (options?: { limit?: number }) => {
  return useInfiniteQuery({
    queryKey: ['ucuts-feed', options?.limit ?? 20],
    queryFn: async ({ pageParam = 1 }) => {
      try {
        const limit = options?.limit ?? 20;
        const res = await api.get(`/api/ucuts/feed?page=${pageParam}&limit=${limit}`);
        const data = res?.data || res;
        if (!data || !data.ucuts) {
          return { ucuts: [], page: pageParam, totalPages: 1, totalCount: 0 };
        }
        return data;
      } catch (error: any) {
        Toast.show({
          type: 'error',
          text1: 'Fetch Failed',
          text2: getShortErrorMessage(error, 'Request failed.'),
        });
        return { ucuts: [], page: pageParam, totalPages: 1, totalCount: 0 };
      }
    },
    getNextPageParam: (lastPage: any) => {
      const page = lastPage?.page ?? 1;
      const totalPages = lastPage?.totalPages ?? 1;
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
  });
};

export const useLikeUCuts = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ucutId: string) => {
      const res = await api.post(`/api/ucuts/${ucutId}/like`);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ucuts-feed'] });
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Like Failed',
        text2: getShortErrorMessage(error, 'Request failed.'),
      });
    },
  });
};

export const useUnlikeUCuts = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ucutId: string) => {
      const res = await api.delete(`/api/ucuts/${ucutId}/like`);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ucuts-feed'] });
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Unlike Failed',
        text2: getShortErrorMessage(error, 'Request failed.'),
      });
    },
  });
};

export const useCommentUCuts = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      ucutId,
      text,
    }: {
      ucutId: string;
      text: string;
    }) => {
      const res = await api.post(`/api/ucuts/${ucutId}/comments`, { text });
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ucuts-feed'] });
      queryClient.invalidateQueries({ queryKey: ['ucuts-comments'] });
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Comment Failed',
        text2: getShortErrorMessage(error, 'Request failed.'),
      });
    },
  });
};

export const useGetUCutsComments = (
  ucutId: string,
  options?: { enabled?: boolean; limit?: number }
) => {
  return useInfiniteQuery({
    queryKey: ['ucuts-comments', ucutId, options?.limit ?? 20],
    queryFn: async ({ pageParam = 1 }) => {
      try {
        const limit = options?.limit ?? 20;
        const res = await api.get(`/api/ucuts/${ucutId}/comments?page=${pageParam}&limit=${limit}`);
        const data = res?.data || res;
        if (!data) {
          return { comments: [], page: pageParam, totalPages: 1 };
        }
        return data;
      } catch (error: any) {
        Toast.show({
          type: 'error',
          text1: 'Fetch Failed',
          text2: getShortErrorMessage(error, 'Request failed.'),
        });
        return { comments: [], page: pageParam, totalPages: 1 };
      }
    },
    getNextPageParam: (lastPage: any) => {
      const page = lastPage?.page ?? 1;
      const totalPages = lastPage?.totalPages ?? 1;
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: options?.enabled,
  });
};

export const useDeleteUCuts = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ucutId: string) => {
      const res = await api.delete(`/api/ucuts/${ucutId}`);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ucuts-feed'] });
      queryClient.invalidateQueries({ queryKey: ['ucuts'] });
      Toast.show({
        type: 'success',
        text1: 'UCuts Deleted',
        text2: 'Your UCuts has been removed.',
      });
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Delete Failed',
        text2: getShortErrorMessage(error, 'Request failed.'),
      });
    },
  });
};
