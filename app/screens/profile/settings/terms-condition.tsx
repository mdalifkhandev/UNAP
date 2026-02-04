import BackButton from '@/components/button/BackButton';
import GradientBackground from '@/components/main/GradientBackground';
import { useTranslateTexts } from '@/hooks/app/translate';
import useLanguageStore from '@/store/language.store';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TermsCondition = () => {
  const { language } = useLanguageStore();
  const { data: t } = useTranslateTexts({
    texts: [
      'Terms & Condition',
      'Welcome to Services App !',
      'Accessing or using our services, you agree to be bound by these Terms of Service. If you do not agree with any part of the terms, you must not use our services.',
      '2. User Responsibilities As a user, you agree to:',
      'Use the service only for lawful purposes.',
      'Provide accurate and complete information when required.',
      'Maintain the confidentiality of your account password.',
      '3. Intellectual Property',
      'All content, trademarks, and data on this service, including but not limited to text, graphics, logos, and images, are the property of [Your Company Name]',
      '4. Disclaimers',
      'The service is provided on an "as is" and "as available" basis. [Your Company Name] makes no warranties, expressed or implied, regarding the operation.',
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
            {tx(0, 'Terms & Condition')}
          </Text>
        </View>
        <View className='border-b border-black/20 dark:border-[#FFFFFF0D] dark:border-[#FFFFFF0D] w-full mt-2'></View>
        <ScrollView
          className='mx-6 mt-6'
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 50 }}
        >
          {/* main info */}
          <View className='bg-[#F0F2F5] dark:bg-[#FFFFFF0D] p-6 rounded-xl'>
            <Text className=' text-primary dark:text-white font-roboto-semibold text-xl'>
              {tx(0, 'Terms & Condition')}
            </Text>
            <Text className=' text-primary dark:text-white font-roboto-regular mt-6 text-xl'>
              {tx(1, 'Welcome to Services App !')}
            </Text>
            <Text className='text-primary dark:text-white/80  mt-2 font-roboto-regular'>
              {tx(
                2,
                'Accessing or using our services, you agree to be bound by these Terms of Service. If you do not agree with any part of the terms, you must not use our services.'
              )}
            </Text>

            {/* 1.Information we collect */}
            <Text className=' mt-6 text-primary dark:text-white font-roboto-regular text-lg '>
              {tx(3, '2. User Responsibilities As a user, you agree to:')}
            </Text>

            <View className='flex-row items-start mt-2 mb-3'>
              <View className='w-2 h-2 bg-white rounded-full mt-3.5 mr-3' />

              <Text className='text-primary dark:text-white/80  mt-2 font-roboto-regular'>
                {tx(4, 'Use the service only for lawful purposes.')}
              </Text>
            </View>
            <View className='flex-row items-start mb-3'>
              <View className='w-2 h-2 bg-white rounded-full mt-1.5 mr-3' />

              <Text className='text-primary dark:text-white/80   font-roboto-regular'>
                {tx(5, 'Provide accurate and complete information when required.')}
              </Text>
            </View>
            <View className='flex-row items-start mb-3'>
              <View className='w-2 h-2 bg-white rounded-full mt-1.5 mr-3' />

              <Text className='text-primary dark:text-white/80   font-roboto-regular'>
                {tx(6, 'Maintain the confidentiality of your account password.')}
              </Text>
            </View>

            {/* 3. Intellectual Property */}
            <Text className=' mt-6 text-primary dark:text-white font-roboto-regular text-lg '>
              {tx(7, '3. Intellectual Property')}
            </Text>

            <Text className='text-primary dark:text-white/80 mt-2 font-roboto-regular'>
              {tx(
                8,
                'All content, trademarks, and data on this service, including but not limited to text, graphics, logos, and images, are the property of [Your Company Name]'
              )}
            </Text>

            {/* 4. Disclaimers */}
            <Text className=' mt-6 text-primary dark:text-white font-roboto-regular text-lg '>
              {tx(9, '4. Disclaimers')}
            </Text>

            <Text className='text-primary dark:text-white/80 mt-2 font-roboto-regular'>
              {tx(
                10,
                'The service is provided on an "as is" and "as available" basis. [Your Company Name] makes no warranties, expressed or implied, regarding the operation.'
              )}
            </Text>

            {/* 5. Disclaimers */}
            <Text className=' mt-6 text-primary dark:text-white font-roboto-regular text-lg '>
              {tx(9, '4. Disclaimers')}
            </Text>

            <Text className='text-primary dark:text-white/80 mt-2 font-roboto-regular'>
              {tx(
                10,
                'The service is provided on an "as is" and "as available" basis. [Your Company Name] makes no warranties, expressed or implied, regarding the operation.'
              )}
            </Text>

            {/* 6. Disclaimers */}
            <Text className=' mt-6 text-primary dark:text-white font-roboto-regular text-lg '>
              {tx(9, '4. Disclaimers')}
            </Text>

            <Text className='text-primary dark:text-white/80 mt-2 font-roboto-regular'>
              {tx(
                10,
                'The service is provided on an "as is" and "as available" basis. [Your Company Name] makes no warranties, expressed or implied, regarding the operation.'
              )}
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default TermsCondition;
