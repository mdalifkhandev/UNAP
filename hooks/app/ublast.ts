import api from '@/api/axiosInstance';
import { useQuery } from '@tanstack/react-query';
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
