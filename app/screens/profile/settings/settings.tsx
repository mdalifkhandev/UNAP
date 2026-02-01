import BackButton from '@/components/button/BackButton';
import GradientBackground from '@/components/main/GradientBackground';
import useAuthStore from '@/store/auth.store';
import useThemeStore from '@/store/theme.store';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Settings = () => {
  const { clearAuth } = useAuthStore();
  const { mode } = useThemeStore();
  const isLight = mode === 'light';
  const iconColor = isLight ? 'black' : 'white';
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
        <View className='border-b border-black/20 dark:border-[#FFFFFF0D] dark:border-[#292929] w-full mt-2'></View>
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
                  style={{ height: 24, width: 24, marginTop: 10, tintColor: iconColor }}
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
                  style={{ height: 24, width: 24, marginTop: 8, tintColor: iconColor }}
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

            {/* Log Out */}
            <TouchableOpacity
              onPress={hendleLogout}
              className='flex-row justify-between items-center mt-4'
            >
              <View className='flex-row gap-2'>
                <Image
                  source={require('@/assets/images/logout.svg')}
                  contentFit='contain'
                  style={{ height: 24, width: 24, marginTop: 8, tintColor: iconColor }}
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
