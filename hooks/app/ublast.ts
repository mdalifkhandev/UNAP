import api from '@/api/axiosInstance';
import { getShortErrorMessage } from '@/lib/error';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

export const useGetUblastEligibility = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['ublast-eligibility'],
    queryFn: async () => {
      try {
        const res = await api.get('/api/ublasts/eligibility');
        return res;
      } catch (error: any) {
        console.error('API Error in useGetUblastEligibility:', error);
        Toast.show({
          type: 'error',
          text1: 'Fetch Failed',
          text2: getShortErrorMessage(error, 'Request failed.'),
        });
        return null;
      }
    },
    enabled: options?.enabled,
  });
};


// UBlast submission hooks
export const useSubmitUBlast = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      console.log(JSON.stringify(formData, null, 2));

      const res = await api.post('/api/ublasts/submissions', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return res;
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['ublast-posts'] });
      Toast.show({
        type: 'success',
        text1: 'UBlast Submitted',
        text2:
          data?.message ||
          'Your content has been submitted to UBlast successfully.',
      });
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'UBlast Submission Failed',
        text2: getShortErrorMessage(error, 'Request failed.'),
      });
    },
  });
};

export const useGetUBlastPosts = () => {
  return useInfiniteQuery({
    queryKey: ['ublast-posts'],
    queryFn: async ({ pageParam = 1 }) => {
      try {
        const res = await api.get(`/api/ublasts/submissions?page=${pageParam}&limit=12`);
        const data = res?.data || res;
        if (data === undefined || data === null) {
          return { submissions: [], page: pageParam, totalPages: 1 };
        }
        return data;
      } catch (error: any) {
        console.error('API Error in useGetUBlastPosts:', error);
        Toast.show({
          type: 'error',
          text1: 'Fetch Failed',
          text2: 'Could not load UBlast posts.',
        });
        return { submissions: [], page: pageParam, totalPages: 1 };
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

export const useUpdateUBlastPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      postId,
      formData,
    }: {
      postId: string;
      formData: FormData;
    }) => {
      const res = await api.patch(
        `/api/ublasts/submissions/${postId}`,
        formData
      );
      return res;
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['ublast-posts'] });
      Toast.show({
        type: 'success',
        text1: 'UBlast Post Updated',
        text2:
          data?.message || 'Your UBlast post has been updated successfully.',
      });
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: getShortErrorMessage(error, 'Request failed.'),
      });
    },
  });
};

export const useGetActiveUblasts = (options?: { enabled?: boolean; limit?: number }) => {
  return useInfiniteQuery({
    queryKey: ['ublast-active', options?.limit ?? 12],
    queryFn: async ({ pageParam = 1 }) => {
      try {
        const limit = options?.limit ?? 12;
        const res = await api.get(`/api/ublasts/active?page=${pageParam}&limit=${limit}`);
        const data = res?.data || res;
        if (data === undefined || data === null) {
          return { ublasts: [], page: pageParam, totalPages: 1 };
        }
        return data;
      } catch (error: any) {
        console.error('API Error in useGetActiveUblasts:', error);
        Toast.show({
          type: 'error',
          text1: 'Fetch Failed',
          text2: getShortErrorMessage(error, 'Request failed.'),
        });
        return { ublasts: [], page: pageParam, totalPages: 1 };
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

export const useShareUblast = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      ublastId,
      shareType = 'feed',
    }: {
      ublastId: string;
      shareType?: 'feed' | 'story';
    }) => {
      // Ensure profile exists before sharing (backend requires it)
      const profileRes = await api.get('/api/profile/me');
      const profile = profileRes?.data?.profile || profileRes?.profile;
      if (!profile) {
        throw new Error('Complete your profile before sharing.');
      }
      const res = await api.post(`/api/ublasts/${ublastId}/share`, { shareType });
      return res;
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['trendingPost', 'active'] });
      queryClient.invalidateQueries({ queryKey: ['ublast-active'] });
      queryClient.invalidateQueries({ queryKey: ['myPosts'] });
      queryClient.invalidateQueries({ queryKey: ['post'] });
      Toast.show({
        type: 'success',
        text1: 'UBlast Shared',
        text2: data?.message || 'Shared to feed successfully.',
      });
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Share Failed',
        text2: getShortErrorMessage(error, 'Share failed.'),
      });
    },
  });
};
