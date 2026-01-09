import GradientBackground from '@/components/main/GradientBackground';
import useAuthStore from '@/store/auth.store';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { View } from 'react-native';

const SplashScreen = () => {
  const { user } = useAuthStore();
  // replesh to welcome screen after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (user?.token) {
        router.replace('/(tabs)/home');
      } else {
        router.replace('/screens/auth/welcome');
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <GradientBackground className='justify-center items-center'>
      <View className='flex-1 justify-center items-center'>
        <Image
          source={require('@/assets/images/logo.png')}
          style={{ width: 350, height: 150 }}
          contentFit='contain'
        />
      </View>
    </GradientBackground>
  );
};

export default SplashScreen;
