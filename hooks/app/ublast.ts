import api from '@/api/axiosInstance';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

export const useGetUblastEligibility = () => {
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
          text2: error?.response?.data?.message || error.message,
        });
        return null;
      }
    },
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
        text2: error?.response?.data?.message || error.message,
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
      const res = await api.patch(`/api/ublast/posts/${postId}`, formData, {
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
        text1: 'UBlast Post Updated',
        text2:
          data?.message || 'Your UBlast post has been updated successfully.',
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
