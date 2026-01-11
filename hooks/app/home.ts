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
          const result = await api.get('/api/feed?page=1&limit=5');
          return result;
        },
      },
    ],
  });
};

export const useUserFollow = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { userId: string }) => {
      const res = await api.post('/api/follows', data);
      return res;
    },
    onMutate: async variables => {
      await queryClient.cancelQueries({
        queryKey: ['otherProfile', variables.userId],
      });
      await queryClient.cancelQueries({ queryKey: ['post'] });

      const previousOtherProfile = queryClient.getQueryData([
        'otherProfile',
        variables.userId,
      ]);
      const previousPosts = queryClient.getQueryData(['post']);

      // Update otherProfile cache
      queryClient.setQueryData(
        ['otherProfile', variables.userId],
        (old: any) => {
          if (!old) return old;
          return {
            ...old,
            viewerIsFollowing: true,
            profile: {
              ...old.profile,
              followersCount: (old.profile.followersCount || 0) + 1,
            },
          };
        }
      );

      // Update post cache
      queryClient.setQueryData(['post'], (old: any) => {
        if (!old) return old;
        const updatePosts = (posts: any[]) =>
          posts.map(p =>
            p.author?.id === variables.userId
              ? { ...p, viewerIsFollowing: true }
              : p
          );
        if (Array.isArray(old)) return updatePosts(old);
        if (old.posts) return { ...old, posts: updatePosts(old.posts) };
        return old;
      });

      return { previousOtherProfile, previousPosts };
    },
    onError: (err, variables, context) => {
      if (context?.previousOtherProfile) {
        queryClient.setQueryData(
          ['otherProfile', variables.userId],
          context.previousOtherProfile
        );
      }
      if (context?.previousPosts) {
        queryClient.setQueryData(['post'], context.previousPosts);
      }
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: ['post'] });
      queryClient.invalidateQueries({
        queryKey: ['otherProfile', variables.userId],
      });
    },
  });
};

export const useUserUnFollow = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/api/follows/${id}`);
      return res;
    },
    onMutate: async id => {
      await queryClient.cancelQueries({ queryKey: ['otherProfile', id] });
      await queryClient.cancelQueries({ queryKey: ['post'] });

      const previousOtherProfile = queryClient.getQueryData([
        'otherProfile',
        id,
      ]);
      const previousPosts = queryClient.getQueryData(['post']);

      // Update otherProfile cache
      queryClient.setQueryData(['otherProfile', id], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          viewerIsFollowing: false,
          profile: {
            ...old.profile,
            followersCount: Math.max(0, (old.profile.followersCount || 0) - 1),
          },
        };
      });

      // Update post cache
      queryClient.setQueryData(['post'], (old: any) => {
        if (!old) return old;
        const updatePosts = (posts: any[]) =>
          posts.map(p =>
            p.author?.id === id ? { ...p, viewerIsFollowing: false } : p
          );
        if (Array.isArray(old)) return updatePosts(old);
        if (old.posts) return { ...old, posts: updatePosts(old.posts) };
        return old;
      });

      return { previousOtherProfile, previousPosts };
    },
    onError: (err, id, context) => {
      if (context?.previousOtherProfile) {
        queryClient.setQueryData(
          ['otherProfile', id],
          context.previousOtherProfile
        );
      }
      if (context?.previousPosts) {
        queryClient.setQueryData(['post'], context.previousPosts);
      }
    },
    onSettled: (data, error, id) => {
      queryClient.invalidateQueries({ queryKey: ['post'] });
      queryClient.invalidateQueries({ queryKey: ['otherProfile', id] });
    },
  });
};

export const useUserLike = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { postId: string }) => {
      const res = await api.post(`/api/likes`, data);
      return res;
    },
    onMutate: async variables => {
      await queryClient.cancelQueries({ queryKey: ['post'] });
      const previousPosts = queryClient.getQueryData(['post']);

      queryClient.setQueryData(['post'], (old: any) => {
        if (!old) return old;
        const updatePosts = (posts: any[]) =>
          posts.map(p =>
            p._id === variables.postId
              ? {
                  ...p,
                  viewerHasLiked: true,
                  likeCount: (p.likeCount || 0) + 1,
                }
              : p
          );
        if (Array.isArray(old)) return updatePosts(old);
        if (old.posts) return { ...old, posts: updatePosts(old.posts) };
        return old;
      });

      return { previousPosts };
    },
    onError: (err, variables, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(['post'], context.previousPosts);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['post'] });
    },
  });
};

export const useUserUnLike = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/api/likes/${id}`);
      return res;
    },
    onMutate: async id => {
      await queryClient.cancelQueries({ queryKey: ['post'] });
      const previousPosts = queryClient.getQueryData(['post']);

      queryClient.setQueryData(['post'], (old: any) => {
        if (!old) return old;
        const updatePosts = (posts: any[]) =>
          posts.map(p =>
            p._id === id
              ? {
                  ...p,
                  viewerHasLiked: false,
                  likeCount: Math.max(0, (p.likeCount || 0) - 1),
                }
              : p
          );
        if (Array.isArray(old)) return updatePosts(old);
        if (old.posts) return { ...old, posts: updatePosts(old.posts) };
        return old;
      });

      return { previousPosts };
    },
    onError: (err, id, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(['post'], context.previousPosts);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['post'] });
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
