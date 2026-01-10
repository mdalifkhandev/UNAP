import api from '@/api/axiosInstance';
import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

export const useGetAllPost = () => {
  return useQueries({
    queries: [
      {
        queryKey: ['post'],
        queryFn: async () => {
          const result = await api.get('/api/feed');
          return result;
        },
      },
    ],
  });
};

export const useUserFollow = () => {
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post('/api/follows', data);
      return res;
    },
  });
};

export const useUserUnFollow = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/api/follows/${id}`);
      return res;
    },
  });
};

export const useUserLike = () => {
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post(`/api/likes`, data);
      return res;
    },
  });
};

export const useUserUnLike = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/api/likes/${id}`);
      return res;
    },
  });
};

export const useUserGetComment = (id: string) => {
  return useQuery({
    queryKey: ['comment', id],
    queryFn: async () => {
      const res = await api.get(`/api/comments?postId=${id}`);
      return res || { comments: [] };
    },
    enabled: !!id,
  });
};

export const useUserCreateComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { postId: string; text: string }) => {
      const res = await api.post('/api/comments', data);
      return res;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['comment', variables.postId],
      });
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      commentId,
      postId,
    }: {
      commentId: string;
      postId: string;
    }) => {
      const res = await api.delete(`/api/comments/${commentId}`);
      return res;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['comment', variables.postId],
      });
    },
  });
};
