import api from '@/api/axiosInstance';
import { getShortErrorMessage } from '@/lib/error';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
  return useQuery({
    queryKey: ['ublast-posts'],
    queryFn: async () => {
      try {
        const res = await api.get('/api/ublasts/submissions');
        const data = res?.data || res;
        if (data === undefined || data === null) {
          return { submissions: [] };
        }
        return data;
      } catch (error: any) {
        console.error('API Error in useGetUBlastPosts:', error);
        Toast.show({
          type: 'error',
          text1: 'Fetch Failed',
          text2: 'Could not load UBlast posts.',
        });
        return { submissions: [] };
      }
    },
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

export const useGetActiveUblasts = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['ublast-active'],
    queryFn: async () => {
      try {
        const limit = 20;
        const maxPages = 10;
        const all: any[] = [];
        let page = 1;
        let totalPages = 1;

        while (page <= totalPages && page <= maxPages) {
          const res = await api.get(`/api/ublasts/active?page=${page}&limit=${limit}`);
          const data = res?.data || res;
          const ublasts = data?.ublasts || [];
          totalPages = data?.totalPages || totalPages;
          all.push(...ublasts);

          if (!ublasts.length) break;
          page += 1;
        }

        return {
          ublasts: all,
          page: 1,
          totalPages,
          totalCount: all.length,
        };
      } catch (error: any) {
        console.error('API Error in useGetActiveUblasts:', error);
        Toast.show({
          type: 'error',
          text1: 'Fetch Failed',
          text2: getShortErrorMessage(error, 'Request failed.'),
        });
        return { ublasts: [] };
      }
    },
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
