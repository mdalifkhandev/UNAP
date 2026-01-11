import api from '@/api/axiosInstance';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient
} from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

export const useGetAllPost = () => {
  return useInfiniteQuery({
    queryKey: ['post'],
    queryFn: async ({ pageParam = 1 }) => {
      const result = await api.get(`/api/feed?page=${pageParam}&limit=5`);
      return result;
    },
    getNextPageParam: (lastPage: any, allPages) => {
      const posts = lastPage?.posts || [];
      if (posts.length < 5) return undefined;
      return allPages.length + 1;
    },
    initialPageParam: 1,
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

      queryClient.setQueryData(['post'], (old: any) => {
        if (!old) return old;
        const updatePosts = (posts: any[]) =>
          posts.map(p =>
            p.author?.id === variables.userId
              ? { ...p, viewerIsFollowing: true }
              : p
          );
        if (Array.isArray(old)) return updatePosts(old);
        if (old.pages) {
          return {
            ...old,
            pages: old.pages.map((page: any) => ({
              ...page,
              posts: updatePosts(page.posts),
            })),
          };
        }
        return old;
      });

      return { previousOtherProfile, previousPosts };
    },
    onSuccess: (data: any) => {
      Toast.show({
        type: 'success',
        text1: 'Followed',
        text2: data?.message || 'You are now following this user.',
      });
    },
    onError: (err: any, variables, context) => {
      if (context?.previousOtherProfile) {
        queryClient.setQueryData(
          ['otherProfile', variables.userId],
          context.previousOtherProfile
        );
      }
      if (context?.previousPosts) {
        queryClient.setQueryData(['post'], context.previousPosts);
      }
      Toast.show({
        type: 'error',
        text1: 'Follow Failed',
        text2: err?.response?.data?.message || err.message,
      });
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

      queryClient.setQueryData(['post'], (old: any) => {
        if (!old) return old;
        const updatePosts = (posts: any[]) =>
          posts.map(p =>
            p.author?.id === id ? { ...p, viewerIsFollowing: false } : p
          );
        if (Array.isArray(old)) return updatePosts(old);
        if (old.pages) {
          return {
            ...old,
            pages: old.pages.map((page: any) => ({
              ...page,
              posts: updatePosts(page.posts),
            })),
          };
        }
        return old;
      });

      return { previousOtherProfile, previousPosts };
    },
    onSuccess: (data: any) => {
      Toast.show({
        type: 'success',
        text1: 'Unfollowed',
        text2: data?.message || 'You have unfollowed this user.',
      });
    },
    onError: (err: any, id, context) => {
      if (context?.previousOtherProfile) {
        queryClient.setQueryData(
          ['otherProfile', id],
          context.previousOtherProfile
        );
      }
      if (context?.previousPosts) {
        queryClient.setQueryData(['post'], context.previousPosts);
      }
      Toast.show({
        type: 'error',
        text1: 'Unfollow Failed',
        text2: err?.response?.data?.message || err.message,
      });
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
        if (old.pages) {
          return {
            ...old,
            pages: old.pages.map((page: any) => ({
              ...page,
              posts: updatePosts(page.posts),
            })),
          };
        }
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
        if (old.pages) {
          return {
            ...old,
            pages: old.pages.map((page: any) => ({
              ...page,
              posts: updatePosts(page.posts),
            })),
          };
        }
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
    onSuccess: (data: any, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['comment', variables.postId],
      });
      Toast.show({
        type: 'success',
        text1: 'Comment Posted',
        text2: data?.message || 'Your comment has been added.',
      });
    },
    onError: (err: any) => {
      Toast.show({
        type: 'error',
        text1: 'Comment Failed',
        text2: err?.response?.data?.message || err.message,
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
    onSuccess: (data: any, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['comment', variables.postId],
      });
      Toast.show({
        type: 'success',
        text1: 'Comment Deleted',
        text2: data?.message || 'Your comment has been removed.',
      });
    },
    onError: (err: any) => {
      Toast.show({
        type: 'error',
        text1: 'Delete Failed',
        text2: err?.response?.data?.message || err.message,
      });
    },
  });
};

export const useSavePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { postId: string }) => {
      const res = await api.post('/api/bookmarks', data);
      return res;
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['saved-posts'] });
      Toast.show({
        type: 'success',
        text1: 'Post Saved',
        text2: data?.message || 'Post added to your bookmarks.',
      });
    },
    onError: (err: any) => {
      Toast.show({
        type: 'error',
        text1: 'Save Failed',
        text2: err?.response?.data?.message || err.message,
      });
    },
  });
};

export const useUnsavePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/api/bookmarks/${id}`);
      return res;
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['saved-posts'] });
      Toast.show({
        type: 'success',
        text1: 'Post Removed',
        text2: data?.message || 'Post removed from your bookmarks.',
      });
    },
    onError: (err: any) => {
      Toast.show({
        type: 'error',
        text1: 'Remove Failed',
        text2: err?.response?.data?.message || err.message,
      });
    },
  });
};

export const useGetSavedPosts = () => {
  return useQuery({
    queryKey: ['saved-posts'],
    queryFn: async () => {
      const res = await api.get('/api/bookmarks');
      return res;
    },
  });
};
