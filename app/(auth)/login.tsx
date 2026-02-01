import BackButton from '@/components/button/BackButton';
import ShadowButton from '@/components/button/ShadowButton';
import Inpute from '@/components/inpute/Inpute';
import GradientBackground from '@/components/main/GradientBackground';
import { useUserLogin } from '@/hooks/app/auth';
import useAuthStore from '@/store/auth.store';
import Feather from '@expo/vector-icons/Feather';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

const Login = () => {
  const [rememberMe, setRememberMe] = useState(false);
  const { mutate } = useUserLogin();
  const { setUser } = useAuthStore();

  // Login input states
  const [phoneNumber, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      alert('Please fill all fields');
      return;
    }

    if (!rememberMe) {
      alert('Please agree to Remember Me');
      return;
    }
    const user = {
      phoneNumber,
      email,
      password,
    };

    mutate(user, {
      onSuccess: data => {
        Toast.show({
          type: 'success',
          text1: 'Login Successful',
          text2: 'Welcome back to UNAP',
        });
        const user = {
          //@ts-ignore
          refreshToken: data?.refreshToken,
          //@ts-ignore
          token: data?.token,
          //@ts-ignore
          email: data?.user.email,
          //@ts-ignore
          name: data?.user.name,
          //@ts-ignore
          phoneNumber: data?.user.phoneNumber,
          //@ts-ignore
          id: data?.user.id,
        };
        setUser(user);
        router.push('/(tabs)/trending');
      },
      onError: error => {
        Toast.show({
          type: 'error',
          text1: 'Login Failed',
          text2: error.message,
        });
      },
    });
  };

  return (
    <GradientBackground>
      <KeyboardAvoidingView
        className='flex-1'
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <SafeAreaView
          className='flex-1 mx-6 mt-2.5'
          edges={['top', 'bottom', 'left', 'right']}
        >
          <BackButton />

          <View className='flex-1 justify-center'>
            <View>
              <Text className='text-[#000000] text-2xl font-roboto-semibold mt-6 text-center'>
                Welcome Back!
              </Text>
              <Text className='font-roboto-medium text-secondary dark:text-white/80 text-sm text-center mt-1.5'>
                Login to your account
              </Text>
            </View>

            <View className='bg-[#F0F2F5] dark:bg-[#FFFFFF0D] border border-black/20 dark:border-[#FFFFFF0D] dark:border-[#FFFFFF0D] p-6 rounded-3xl mt-6'>
              <Inpute
                title='Phone'
                placeholder='+880 123 123 123'
                className='mt-4'
                // @ts-ignore
                value={phoneNumber}
                onChangeText={setPhone}
              />

              <Inpute
                title='Email'
                placeholder='example@example.com'
                className='mt-4'
                required={true}
                // @ts-ignore
                value={email}
                onChangeText={setEmail}
                type='email-address'
              />

              <Inpute
                title='Password'
                placeholder='********'
                className='mt-4'
                required={true}
                isPassword={true}
                // @ts-ignore
                value={password}
                onChangeText={setPassword}
              />

              <View className='mt-4 flex-row justify-between items-center'>
                <View className='flex-row gap-2 items-center'>
                  <TouchableOpacity
                    onPress={() => setRememberMe(!rememberMe)}
                    className={`h-5 w-5 rounded-md flex-row justify-center items-center ${
                      rememberMe ? 'bg-blue-600' : 'bg-secondary'
                    }`}
                  >
                    {rememberMe && (
                      <Feather name='check' size={16} color='#ffffff' />
                    )}
                  </TouchableOpacity>
                  <Text className='text-secondary dark:text-white/80 text-sm font-roboto-medium mt-1.5'>
                    Remember me
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => router.push('/(auth)/forget-password')}
                >
                  <Text className='text-[#000000] font-roboto-regular text-sm'>
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
              </View>

              <ShadowButton
                text='Login'
                textColor='#2B2B2B'
                backGroundColor='#E8EBEE'
                onPress={handleLogin}
                className='mt-4'
              />

              <View className='mt-4 flex-row justify-center items-center'>
                <Text className='text-secondary dark:text-white/80 font-roboto-regular text-sm'>
                  Don&apos;t have an account?{' '}
                </Text>
                <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
                  <Text className='font-roboto-bold text-secondary dark:text-white/80 text-sm'>
                    {' '}
                    Register
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className='mt-6'>
              <Text className='text-secondary dark:text-white/80 text-center font-roboto-regular'>
                Or continue with
              </Text>
              <View className='mt-6 flex-row justify-between items-center gap-6'>
                <TouchableOpacity className='border border-black/20 dark:border-[#FFFFFF0D] dark:border-[#FFFFFF0D] rounded-xl flex-1 p-3 bg-transparent items-center'>
                  <Image
                    source={require('@/assets/images/google.svg')}
                    contentFit='contain'
                    style={{ height: 24, width: 24 }}
                  />
                </TouchableOpacity>
                <TouchableOpacity className='border border-black/20 dark:border-[#FFFFFF0D] dark:border-[#FFFFFF0D] rounded-xl flex-1 p-3 bg-transparent items-center'>
                  <Image
                    source={require('@/assets/images/apple.svg')}
                    contentFit='contain'
                    style={{ height: 24, width: 24 }}
                  />
                </TouchableOpacity>
                <TouchableOpacity className='border border-black/20 dark:border-[#FFFFFF0D] dark:border-[#FFFFFF0D] rounded-xl flex-1 p-3 bg-transparent items-center'>
                  <Image
                    source={require('@/assets/images/instagram.svg')}
                    contentFit='contain'
                    style={{ height: 24, width: 24 }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
};

export default Login;
