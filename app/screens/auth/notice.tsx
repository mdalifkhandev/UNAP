import BackButton from '@/components/button/BackButton';
import ShadowButton from '@/components/button/ShadowButton';
import GradientBackground from '@/components/main/GradientBackground';
import { router } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Notice = () => {
  return (
    <GradientBackground>
      <SafeAreaView
        className='flex-1 mx-6 mt-2.5'
        edges={['top', 'bottom', 'left', 'right']}
      >
        {/* back button */}
        <BackButton />

        <View className='flex-1 mt-32 items-center'>
          {/* welcome text */}
          <View>
            <Text className='text-[#000000] text-2xl font-roboto-semibold mt-6 text-center'>
              Important Notice!
            </Text>
          </View>

          {/* emain input */}

          <View className=' p-6 bg-[#F0F2F5] dark:bg-[#FFFFFF0D] rounded-3xl mt-6'>
            <View className='mx-4'>
              <Text className='font-roboto-regular text-sm text-primary dark:text-white'>
                To stay active in the UNAP community, you must share and promote
                any officially selected release within 72 hours!
              </Text>
              <Text className='font-roboto-regular text-sm text-primary dark:text-white mt-3'>
                If you fail to promote within this time:
              </Text>
              <View className=' flex-row mt-6 gap-2'>
                <View className='h-2 w-2 bg-[#3B82F6] mt-4 rounded-full' />
                <Text className='font-roboto-regular text-sm text-[#3B82F6] mt-3'>
                  Your account will be suspended for 15 Days
                </Text>
              </View>
              <View className=' flex-row mt-2 gap-2'>
                <View className='h-2 w-2 bg-[#3B82F6] mt-4 rounded-full' />
                <Text className='font-roboto-regular text-sm text-[#3B82F6] mt-3'>
                  You will not be able to upload, post, comment, or share
                </Text>
              </View>
              <View className=' flex-row mt-2 gap-2'>
                <View className='h-2 w-2 bg-[#3B82F6] mt-4 rounded-full' />
                <Text className='font-roboto-regular text-sm text-[#3B82F6] mt-3'>
                  You will only be able to view the community feed
                </Text>
              </View>
              <Text className='text-[#009951] font-roboto-medium text-sm mt-3'>
                By continuing, you agree to follow this rule!
              </Text>
            </View>

            {/* Back to Login button */}
            <ShadowButton
              text='OK'
              textColor='#2B2B2B'
              backGroundColor='#E8EBEE'
              onPress={() => router.push('/(auth)/signup')}
              className='mt-4'
            />
          </View>
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default Notice;
