import BackButton from '@/components/button/BackButton';
import GradientBackground from '@/components/main/GradientBackground';
import Entypo from '@expo/vector-icons/Entypo';
import { useTranslateTexts } from '@/hooks/app/translate';
import useLanguageStore from '@/store/language.store';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const HelpSupport = () => {
  const [isEmailOn, setIsEmailOn] = useState(false);
  const [isSMSOn, setIsSMSOn] = useState(true);
  const { language } = useLanguageStore();
  const { data: t } = useTranslateTexts({
    texts: ['Help & Support', 'Faq', 'Contact Us'],
    targetLang: language,
    enabled: !!language && language !== 'EN',
  });
  const tx = (i: number, fallback: string) =>
    t?.translations?.[i] || fallback;
  return (
    <GradientBackground>
      <SafeAreaView className='flex-1 mt-2.5' edges={['top', 'left', 'right']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <View className='flex-row mt-4 mx-6'>
            <BackButton />
            <Text className='text-primary dark:text-white font-roboto-bold text-2xl text-center flex-1'>
              {tx(0, 'Help & Support')}
            </Text>
          </View>
          <View className='border-b border-black/20 dark:border-[#FFFFFF0D] dark:border-[#FFFFFF0D] w-full mt-2'></View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 72, marginHorizontal: 24 }}
          >
            <TouchableOpacity
              onPress={() => router.push('/screens/profile/settings/faq')}
              className='flex-row  justify-between py-3 px-5 border border-black/20 dark:border-[#FFFFFF0D] dark:border-[#FFFFFF0D] rounded-2xl mt-6 items-center bg-[#F0F2F5] dark:bg-[#FFFFFF0D]'
            >
              <Text className='text-primary dark:text-white font-roboto-semibold'>
                {tx(1, 'Faq')}
              </Text>
              <Entypo
                name='chevron-small-right'
                className='mt-2.5'
                size={26}
                color='black'
              />
            </TouchableOpacity>
            <View className='flex-row  justify-between py-3 px-5 border border-black/20 dark:border-[#FFFFFF0D] dark:border-[#FFFFFF0D] rounded-2xl mt-3 items-center bg-[#F0F2F5] dark:bg-[#FFFFFF0D]'>
              <Text className='text-primary dark:text-white font-roboto-semibold'>
                {tx(2, 'Contact Us')}
              </Text>
              <Entypo
                name='chevron-small-right'
                className='mt-2.5'
                size={26}
                color='black'
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default HelpSupport;
