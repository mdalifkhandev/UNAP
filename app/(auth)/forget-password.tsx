import BackButton from '@/components/button/BackButton';
import ShadowButton from '@/components/button/ShadowButton';
import Inpute from '@/components/inpute/Inpute';
import GradientBackground from '@/components/main/GradientBackground';
import { useUserForgatePasswordSendMail } from '@/hooks/app/auth';
import useAuthStore from '@/store/auth.store';
import useThemeStore from '@/store/theme.store';
import { router } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Toast from 'react-native-toast-message';

const ForgetPassword = () => {
  const [email, setEmail] = React.useState('');
  const { mutate } = useUserForgatePasswordSendMail();
  const { setEmail: setEmailInLocal } = useAuthStore();

  const hendleForgatePasswordSendMail = () => {
    if (!email.trim()) {
      return Toast.show({
        type: 'error',
        text1: 'Required',
        text2: 'Please enter your email',
      });
    }
    mutate(
      { email },
      {
        onSuccess: data => {
          setEmailInLocal(email);
          router.push('/screens/auth/otp-verify');
        },
      }
    );
  };

  const { mode } = useThemeStore();
  const isLight = mode === 'light';

  return (
    <GradientBackground>
      <SafeAreaView
        className='flex-1 mx-6 mt-2.5'
        edges={['top', 'bottom', 'left', 'right']}
      >
        {/* back button */}
        <BackButton />

        {/* welcome text */}
        <View>
          <Text className='text-[#000000] dark:text-white text-2xl font-roboto-semibold mt-6 text-center'>
            Forget Password
          </Text>
          <Text className='font-roboto-medium text-secondary dark:text-white/80 text-sm text-center mt-1.5 '>
            Enter your email address and we’ll send you a code to {'\n'} reset
            your password
          </Text>
        </View>

        {/* emain input */}
        <View className=' p-6 bg-[#F0F2F5] dark:bg-[#FFFFFF0D] rounded-3xl mt-6'>
          <Inpute
            title='Email'
            placeholder='example@example.com'
            className='mt-4'
            value={email}
            onChangeText={text => setEmail(text)}
            type='email-address'
          />

          {/* Back to Login button */}
          <ShadowButton
            text='Send Reset Code'
            textColor={isLight ? 'white' : '#2B2B2B'}
            backGroundColor={isLight ? 'black' : '#E8EBEE'}
            onPress={hendleForgatePasswordSendMail}
            className='mt-4'
          />

          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
            <Text className='text-center text-primary dark:text-white font-roboto-regular text-sm mt-4'>
              Back to Login
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default ForgetPassword;
