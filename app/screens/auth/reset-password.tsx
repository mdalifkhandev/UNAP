import BackButton from '@/components/button/BackButton';
import ShadowButton from '@/components/button/ShadowButton';
import Input from '@/components/inpute/Inpute';
import GradientBackground from '@/components/main/GradientBackground';
import { useUserForgatePasswordResetPassword } from '@/hooks/app/auth';
import { useTranslateTexts } from '@/hooks/app/translate';
import useAuthStore from '@/store/auth.store';
import useLanguageStore from '@/store/language.store';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Toast from 'react-native-toast-message';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { mutate } = useUserForgatePasswordResetPassword();
  const { resetToken, user } = useAuthStore();
  const { language } = useLanguageStore();
  const { data: t } = useTranslateTexts({
    texts: [
      'Set a new password',
      'Enter & confirm your new password',
      'New Password',
      'Confirm Password',
      'Update Password',
      'Please enter your password',
      'Password does not match',
    ],
    targetLang: language,
    enabled: !!user?.token && !!language && language !== 'EN',
  });
  const tx = (i: number, fallback: string) =>
    t?.translations?.[i] || fallback;

  const handleForgatePasswordResetPassword = () => {
    if (!newPassword.trim() || !confirmPassword.trim()) {
      return Toast.show({
        type: 'error',
        text1: 'Required',
        text2: tx(5, 'Please enter your password'),
      });
    }
    if (newPassword !== confirmPassword) {
      return Toast.show({
        type: 'error',
        text1: 'Mismatch',
        text2: tx(6, 'Password does not match'),
      });
    }

    const data = {
      newPassword,
      confirmPassword,
    };

    mutate(
      { data, token: resetToken },
      {
        onSuccess: data => {
          router.push('/(auth)/login');
        },
      }
    );
  };
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
            {tx(0, 'Set a new password')}
          </Text>
          <Text className='font-roboto-medium text-secondary dark:text-white/80 text-sm text-center mt-1.5 '>
            {tx(1, 'Enter & confirm your new password')}
          </Text>
        </View>

        {/* emain input */}
        <View className=' p-6 bg-[#F0F2F5] dark:bg-[#FFFFFF0D] rounded-3xl mt-6'>
          <Input
            title={tx(2, 'New Password')}
            placeholder='Enter new password'
            className='mt-4'
            isPassword={true}
            value={newPassword}
            onChangeText={(text: string) => setNewPassword(text)}
          />
          <Input
            title={tx(3, 'Confirm Password')}
            placeholder='Confirm new password'
            className='mt-4'
            isPassword={true}
            value={confirmPassword}
            onChangeText={(text: string) => setConfirmPassword(text)}
          />

          {/* Back to Login button */}
          <ShadowButton
            text={tx(4, 'Update Password')}
            textColor='#2B2B2B'
            backGroundColor='#E8EBEE'
            onPress={handleForgatePasswordResetPassword}
            className='mt-4'
          />
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default ResetPassword;
