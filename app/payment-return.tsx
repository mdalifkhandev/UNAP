import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import Toast from 'react-native-toast-message';

export default function PaymentReturnScreen() {
  const { payment } = useLocalSearchParams<{ payment?: string }>();

  useEffect(() => {
    if (payment === 'success') {
      Toast.show({
        type: 'success',
        text1: 'Payment Complete',
        text2: 'Offer payment completed successfully.',
      });
    } else if (payment === 'cancel') {
      Toast.show({
        type: 'info',
        text1: 'Payment Cancelled',
        text2: 'You cancelled the payment.',
      });
    }
    router.replace('/(tabs)/trending');
  }, [payment]);

  return (
    <View className='flex-1 items-center justify-center'>
      <ActivityIndicator size='large' />
    </View>
  );
}
