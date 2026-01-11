import api from '@/api/axiosInstance';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

export const useGetMyProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await api.get(`/api/profile/me`);
      return res;
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await api.patch('/api/profile/me', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return res;
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      Toast.show({
        type: 'success',
        text1: 'Profile Updated',
        text2: data?.message || 'Your profile has been updated successfully.',
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

export const useCompleteProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await api.post('/api/profile/complete', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return res;
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      Toast.show({
        type: 'success',
        text1: 'Profile Completed',
        text2: data?.message || 'Your profile has been completed successfully.',
      });
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Submission Failed',
        text2: error?.response?.data?.message || error.message,
      });
    },
  });
};

export const useGetOtherProfile = (id: string) => {
  return useQuery({
    queryKey: ['otherProfile', id],
    queryFn: async () => {
      const res = await api.get(`/api/users/${id}/overview`);
      return res;
    },
  });
};
