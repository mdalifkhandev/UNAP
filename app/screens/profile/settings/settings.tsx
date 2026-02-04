import BackButton from '@/components/button/BackButton';
import { ToggleButton } from '@/components/button/ToggleButton';
import GradientBackground from '@/components/main/GradientBackground';
import useAuthStore from '@/store/auth.store';
import useThemeStore from '@/store/theme.store';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function normalizeLanguage(input: any) {
  if (!input) return null;
  const raw = String(input).replace('_', '-').toUpperCase();
  if (raw.startsWith('EN-')) {
    if (raw === 'EN-US' || raw === 'EN-GB') return raw;
    return 'EN';
  }
  if (raw.startsWith('PT-')) {
    if (raw === 'PT-BR') return 'PT-BR';
    return 'PT-PT';
  }
  const base = raw.split('-')[0];
  return base;
}

const Settings = () => {
  const { clearAuth } = useAuthStore();
  const { mode, setMode } = useThemeStore();
  const isLight = mode === 'light';
  const iconColor = isLight ? 'black' : 'white';
  const isDarkMode = useMemo(() => mode === 'dark', [mode]);
  const [langOpen, setLangOpen] = useState(false);
  const [language, setLanguage] = useState('EN');
  const langOptions = useMemo(
    () => [
      { code: 'EN', name: 'English' },
      { code: 'EN-US', name: 'English (US)' },
      { code: 'EN-GB', name: 'English (UK)' },
      { code: 'PT-PT', name: 'Portuguese (PT)' },
      { code: 'PT-BR', name: 'Portuguese (BR)' },
      { code: 'ES', name: 'Spanish' },
      { code: 'FR', name: 'French' },
    ],
    []
  );
  const displayLang = useMemo(() => {
    const normalized = normalizeLanguage(language) || 'EN';
    const match =
      langOptions.find(opt => opt.code === normalized) ||
      langOptions.find(opt => opt.code === language);
    return match?.name || normalized;
  }, [language, langOptions]);
  const hendleLogout = () => {
    clearAuth();
    router.push('/(auth)/login');
  };

  return (
    <GradientBackground>
      <SafeAreaView className='flex-1 mt-2.5' edges={['top', 'left', 'right']}>
        <View className='flex-row mt-4 mx-6'>
          <BackButton />
          <Text className='text-primary dark:text-white font-roboto-bold text-2xl text-center flex-1'>
            Setting
          </Text>
        </View>
        <View className='border-b border-black/20 dark:border-[#FFFFFF0D] w-full mt-2'></View>
        <ScrollView className='mx-6 mt-10' showsVerticalScrollIndicator={false}>
          {/* account info */}
          <View className='bg-[#F0F2F5] dark:bg-[#FFFFFF0D] p-3 rounded-xl'>
            <Text className='mx-3 mt-3 text-primary dark:text-white font-roboto-semibold text-xl'>
              Account Information
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/screens/profile/edit-profile')}
              className='flex-row justify-between items-center mt-6'
            >
              <View className='flex-row gap-2'>
                <Image
                  source={require('@/assets/images/edit-user.svg')}
                  contentFit='contain'
                  style={{
                    height: 24,
                    width: 24,
                    marginTop: 10,
                    tintColor: iconColor,
                  }}
                />
                <Text className='mx-3 mt-3 text-primary dark:text-white font-roboto-regular text-lg'>
                  Edit Profile
                </Text>
              </View>
              <Entypo
                name='chevron-small-right'
                className='mt-3.5'
                size={26}
                color={iconColor}
              />
            </TouchableOpacity>

            {/* Complete Profile */}
            <TouchableOpacity
              onPress={() => router.push('/screens/profile/complete-profile')}
              className='flex-row justify-between items-center mt-6'
            >
              <View className='flex-row gap-2'>
                <Ionicons
                  name='person-add-outline'
                  size={24}
                  className='mt-3'
                  color={iconColor}
                />
                <Text className='mx-3 mt-3 text-primary dark:text-white font-roboto-regular text-lg'>
                  Complete Profile
                </Text>
              </View>
              <Entypo
                name='chevron-small-right'
                className='mt-3.5'
                size={26}
                color={iconColor}
              />
            </TouchableOpacity>
          </View>

          {/* Policy Center */}
          <View className='bg-[#F0F2F5] dark:bg-[#FFFFFF0D] p-3 rounded-xl mt-4'>
            <Text className='mx-3 mt-3 text-primary dark:text-white font-roboto-semibold text-xl'>
              Policy Center
            </Text>

            {/* Privacy Policy */}
            <TouchableOpacity
              onPress={() =>
                router.push('/screens/profile/settings/privacy-policy')
              }
              className='flex-row justify-between items-center mt-6'
            >
              <View className='flex-row gap-2'>
                <Ionicons
                  name='shield-checkmark-outline'
                  size={24}
                  className='mt-3'
                  color={iconColor}
                />
                <Text className='mx-3 mt-3 text-primary dark:text-white font-roboto-regular text-lg'>
                  Privacy Policy
                </Text>
              </View>
              <Entypo
                name='chevron-small-right'
                className='mt-3.5'
                size={26}
                color={iconColor}
              />
            </TouchableOpacity>

            {/* Terms & Condition */}
            <TouchableOpacity
              onPress={() =>
                router.push('/screens/profile/settings/terms-condition')
              }
              className='flex-row justify-between items-center mt-4'
            >
              <View className='flex-row gap-2'>
                <Image
                  source={require('@/assets/images/term.svg')}
                  contentFit='contain'
                  style={{
                    height: 24,
                    width: 24,
                    marginTop: 8,
                    tintColor: iconColor,
                  }}
                />
                <Text className='mx-3 mt-3 text-primary dark:text-white font-roboto-regular text-lg'>
                  Terms & Condition
                </Text>
              </View>
              <Entypo
                name='chevron-small-right'
                className='mt-3.5'
                size={26}
                color={iconColor}
              />
            </TouchableOpacity>

            {/* Faq */}
            <TouchableOpacity
              onPress={() => router.push('/screens/profile/settings/faq')}
              className='flex-row justify-between items-center mt-4'
            >
              <View className='flex-row gap-2'>
                <Feather
                  name='help-circle'
                  size={24}
                  color={iconColor}
                  className='mt-3'
                />
                <Text className='mx-3 mt-3 text-primary dark:text-white font-roboto-regular text-lg'>
                  Faq
                </Text>
              </View>
              <Entypo
                name='chevron-small-right'
                className='mt-3.5'
                size={26}
                color={iconColor}
              />
            </TouchableOpacity>
          </View>
          {/* Settings */}
          <View className='bg-[#F0F2F5] dark:bg-[#FFFFFF0D] p-3 rounded-xl mt-4'>
            <Text className='mx-3 mt-3 text-primary dark:text-white font-roboto-semibold text-xl'>
              Settings
            </Text>

            {/* Notification */}
            <TouchableOpacity
              onPress={() =>
                router.push('/screens/profile/settings/notification-settings')
              }
              className='flex-row justify-between items-center mt-6'
            >
              <View className='flex-row gap-2'>
                <Ionicons
                  name='notifications-outline'
                  size={24}
                  className='mt-3'
                  color={iconColor}
                />
                <Text className='mx-3 mt-3 text-primary dark:text-white font-roboto-regular text-lg'>
                  Notification
                </Text>
              </View>
              <Entypo
                name='chevron-small-right'
                className='mt-3.5'
                size={26}
                color={iconColor}
              />
            </TouchableOpacity>

            {/* Language */}
            <TouchableOpacity
              onPress={() => setLangOpen(prev => !prev)}
              className='flex-row justify-between items-center mt-4'
            >
              <View className='flex-row gap-2'>
                <Ionicons
                  name='language-outline'
                  size={24}
                  className='mt-3'
                  color={iconColor}
                />
                <Text className='mx-3 mt-3 text-primary dark:text-white font-roboto-regular text-lg'>
                  Language
                </Text>
              </View>
              <View className='flex-row items-center gap-2'>
                <Text className='text-primary dark:text-white mt-3'>
                  {displayLang}
                </Text>
                <Entypo
                  name={langOpen ? 'chevron-small-down' : 'chevron-small-right'}
                  className='mt-3.5'
                  size={26}
                  color={iconColor}
                />
              </View>
            </TouchableOpacity>

            {langOpen && (
              <View className='mt-3 mx-3 bg-white/80 dark:bg-[#0B0F15] rounded-xl border border-black/20 dark:border-[#FFFFFF0D] overflow-hidden'>
                {langOptions.map(opt => (
                  <TouchableOpacity
                    key={opt.code}
                    onPress={() => {
                      setLanguage(opt.code);
                      setLangOpen(false);
                    }}
                    className='px-4 py-3 border-b border-black/10 dark:border-[#FFFFFF0D]'
                  >
                    <Text className='text-primary dark:text-white'>
                      {opt.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Dark/Light Mode */}
            <View className='flex-row justify-between items-center mt-4'>
              <View className='flex-row gap-2'>
                <Ionicons
                  name={isDarkMode ? 'moon-outline' : 'sunny-outline'}
                  size={24}
                  className='mt-3'
                  color={iconColor}
                />
                <Text className='mx-3 mt-3 text-primary dark:text-white font-roboto-regular text-lg'>
                  {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                </Text>
              </View>
              <ToggleButton
                isOn={isDarkMode}
                setIsOn={(value: boolean) => setMode(value ? 'dark' : 'light')}
              />
            </View>

            {/* Log Out */}
            <TouchableOpacity
              onPress={hendleLogout}
              className='flex-row justify-between items-center mt-4'
            >
              <View className='flex-row gap-2'>
                <Image
                  source={require('@/assets/images/logout.svg')}
                  contentFit='contain'
                  style={{
                    height: 24,
                    width: 24,
                    marginTop: 8,
                    tintColor: iconColor,
                  }}
                />
                <Text className='mx-3 mt-3 text-primary dark:text-white font-roboto-regular text-lg'>
                  Log Out
                </Text>
              </View>
              <Entypo
                name='chevron-small-right'
                className='mt-3.5'
                size={26}
                color={iconColor}
              />
            </TouchableOpacity>
            {/* Delete Account */}
            <TouchableOpacity className='flex-row justify-between items-center mt-4'>
              <View className='flex-row gap-2'>
                <Ionicons
                  name='trash-outline'
                  size={24}
                  color='red'
                  className='mt-3'
                />
                <Text className='mx-3 mt-3 text-[#FF0000] font-roboto-regular text-lg'>
                  Delete Account
                </Text>
              </View>
              <Entypo
                name='chevron-small-right'
                className='mt-3.5'
                size={26}
                color={iconColor}
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default Settings;
