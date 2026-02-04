import BackButton from '@/components/button/BackButton';
import GradientBackground from '@/components/main/GradientBackground';
import { useTranslateTexts } from '@/hooks/app/translate';
import useLanguageStore from '@/store/language.store';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PrivacyPolicy = () => {
  const { language } = useLanguageStore();
  const { data: t } = useTranslateTexts({
    texts: [
      'Privacy Policy',
      'Privacy & Policy',
      'We collect personal information that you voluntarily provide to us when you register on the [app/service], express an interest in obtaining information about us or our products and services,',
      'The personal information that we collect depends on the context of your interactions with us and the [app/service], the choices you make, and the products and features you use.',
      '1.Information we collect',
      '2.Information use collect',
      'We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you,',
    ],
    targetLang: language,
    enabled: !!language && language !== 'EN',
  });
  const tx = (i: number, fallback: string) =>
    t?.translations?.[i] || fallback;
  return (
    <GradientBackground>
      <SafeAreaView className='flex-1 mt-2.5' edges={['top', 'left', 'right']}>
        <View className='flex-row mt-4 mx-6'>
          <BackButton />
          <Text className='text-primary dark:text-white font-roboto-bold text-2xl text-center flex-1'>
            {tx(0, 'Privacy Policy')}
          </Text>
        </View>
        <View className='border-b border-black/20 dark:border-[#FFFFFF0D] dark:border-[#FFFFFF0D] w-full mt-2'></View>
        <ScrollView className='mx-6 mt-6' showsVerticalScrollIndicator={false}>
          {/* main info */}
          <View className='bg-[#F0F2F5] dark:bg-[#FFFFFF0D] p-6 rounded-xl'>
            <Text className=' text-primary dark:text-white font-roboto-semibold text-xl'>
              {tx(1, 'Privacy & Policy')}
            </Text>
            <Text className='text-primary dark:text-white/80  mt-6 font-roboto-regular'>
              {tx(
                2,
                'We collect personal information that you voluntarily provide to us when you register on the [app/service], express an interest in obtaining information about us or our products and services,'
              )}
            </Text>
            <Text className='text-primary dark:text-white/80  font-roboto-regular'>
              {tx(
                3,
                'The personal information that we collect depends on the context of your interactions with us and the [app/service], the choices you make, and the products and features you use.'
              )}
            </Text>
            {/* 1.Information we collect */}
            <Text className=' mt-6 text-primary dark:text-white font-roboto-regular text-xl'>
              {tx(4, '1.Information we collect')}
            </Text>
            <Text className='text-primary dark:text-white/80  mt-2 font-roboto-regular'>
              {tx(
                3,
                'The personal information that we collect depends on the context of your interactions with us and the [app/service], the choices you make, and the products and features you use.'
              )}
            </Text>

            {/* 2.Information use collect */}
            <Text className=' mt-6 text-primary dark:text-white font-roboto-regular text-xl'>
              {tx(5, '2.Information use collect')}
            </Text>
            <Text className='text-primary dark:text-white/80  mt-2 font-roboto-regular'>
              {tx(
                6,
                'We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you,'
              )}
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default PrivacyPolicy;
