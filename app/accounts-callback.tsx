import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function AccountsCallbackScreen() {
  useEffect(() => {
    router.replace('/(tabs)/profile');
  }, []);

  return (
    <View className='flex-1 items-center justify-center'>
      <ActivityIndicator size='large' />
    </View>
  );
}
