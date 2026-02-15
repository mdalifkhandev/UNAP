import api from '@/api/axiosInstance';
import { getShortErrorMessage } from '@/lib/error';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

export const useGetNotifications = (options?: { enabled?: boolean; limit?: number }) => {
  return useQuery({
    queryKey: ['notifications', options?.limit ?? 50],
    queryFn: async () => {
      const limit = options?.limit ?? 50;
      const res = await api.get(`/api/notifications?page=1&limit=${limit}`);
      return res?.notifications ? res : res?.data || { notifications: [] };
    },
    enabled: options?.enabled,
  });
};

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (notificationId: string) => {
      const res = await api.patch(`/api/notifications/${notificationId}/read`);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: getShortErrorMessage(error, 'Could not mark notification as read.'),
      });
    },
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (notificationId: string) => {
      const res = await api.delete(`/api/notifications/${notificationId}`);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Delete Failed',
        text2: getShortErrorMessage(error, 'Could not delete notification.'),
      });
    },
  });
};
