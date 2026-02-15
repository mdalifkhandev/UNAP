import api from '@/api/axiosInstance';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

export async function registerPushToken(token: string) {
  if (!token) return null;
  const appVersion = Constants.expoConfig?.version || '1.0.0';
  const payload = {
    token,
    platform: Platform.OS,
    appVersion,
  };
  const res = await api.post('/api/notifications/token', payload);
  return res;
}

export async function unregisterPushToken(token: string) {
  if (!token) return null;
  const res = await api.delete('/api/notifications/token', {
    data: { token },
  });
  return res;
}

