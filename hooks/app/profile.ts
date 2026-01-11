import api from '@/api/axiosInstance';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
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
