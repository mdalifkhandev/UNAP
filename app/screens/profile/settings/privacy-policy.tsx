import BackButton from '@/components/button/BackButton';
import GradientBackground from '@/components/main/GradientBackground';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PrivacyPolicy = () => {
  return (
    <GradientBackground>
      <SafeAreaView className='flex-1 mt-2.5' edges={['top', 'left', 'right']}>
        <View className='flex-row mt-4 mx-6'>
          <BackButton />
          <Text className='text-primary font-roboto-bold text-2xl text-center flex-1'>
            Privacy Policy
          </Text>
        </View>
        <View className='border-b border-[#292929] w-full mt-2'></View>
        <ScrollView className='mx-6 mt-6' showsVerticalScrollIndicator={false}>
          {/* main info */}
          <View className='bg-[#FFFFFF0D] p-6 rounded-xl'>
            <Text className=' text-primary font-roboto-semibold text-xl'>
              Privacy & Policy
            </Text>
            <Text className='text-primary/80  mt-6 font-roboto-regular'>
              We collect personal information that you voluntarily provide to us
              when you register on the [app/service], express an interest in
              obtaining information about us or our products and services,
            </Text>
            <Text className='text-primary/80  font-roboto-regular'>
              The personal information that we collect depends on the context of
              your interactions with us and the [app/service], the choices you
              make, and the products and features you use.
            </Text>
            {/* 1.Information we collect */}
            <Text className=' mt-6 text-primary font-roboto-regular text-xl'>
              1.Information we collect
            </Text>
            <Text className='text-primary/80  mt-2 font-roboto-regular'>
              The personal information that we collect depends on the context of
              your interactions with us and the [app/service], the choices you
              make, and the products and features you use.
            </Text>

            {/* 2.Information use collect */}
            <Text className=' mt-6 text-primary font-roboto-regular text-xl'>
              2.Information use collect
            </Text>
            <Text className='text-primary/80  mt-2 font-roboto-regular'>
              We process your personal information for these purposes in
              reliance on our legitimate business interests, in order to enter
              into or perform a contract with you,
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default PrivacyPolicy;
