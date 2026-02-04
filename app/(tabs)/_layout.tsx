import { Tabs, router } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { useTranslateTexts } from '@/hooks/app/translate';
import useLanguageStore from '@/store/language.store';
import useThemeStore from '@/store/theme.store';
import {
  Feather,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
  const { mode } = useThemeStore();
  const isLight = mode === 'light';
  const { language } = useLanguageStore();
  const { data: t } = useTranslateTexts({
    texts: ['Home', 'Trending', 'Post', 'UClips', 'Message', 'Profile'],
    targetLang: language,
    enabled: !!language && language !== 'EN',
  });
  const tx = (i: number, fallback: string) =>
    t?.translations?.[i] || fallback;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: isLight ? '#000000' : '#FFFFFF',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: isLight ? '#FFFFFF' : '#000000',
          paddingBottom: 30,
          height: 90,
          paddingTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name='home'
        options={{
          title: tx(0, 'Home'),
          tabBarIcon: ({ color }) => (
            <Ionicons name='home-outline' size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='trending'
        options={{
          title: tx(1, 'Trending'),
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name='chart-timeline-variant-shimmer'
              size={24}
              color={color}
            />
          ),
        }}
      />
      {/* <Tabs.Screen
        name='create'
        options={{
          title: '',
          tabBarIconStyle: {
            width: 0,
            height: 60,
          },
          tabBarIcon: ({ color }) => (
            <View
              className={`h-14 w-14 rounded-full flex-row justify-center items-center ${
                isLight ? 'bg-[#F0F2F5]' : 'bg-[#1E293B]'
              }`}
            >
              <Feather name='plus-square' size={22} color={color} />
            </View>
          ),
        }}
      /> */}

      <Tabs.Screen
        name='create'
        options={{
          title: tx(2, 'Post'),
          tabBarIcon: ({ color }) => (
            <Feather name='plus-square' size={22} color={color} />
          ),
        }}
        listeners={{
          tabPress: e => {
            e.preventDefault();
            router.replace({
              pathname: '/(tabs)/create',
              params: { reset: Date.now().toString() },
            });
          },
        }}
      />
      <Tabs.Screen
        name='uclips'
        options={{
          title: tx(3, 'UClips'),
          tabBarIcon: ({ color }) => (
            <MaterialIcons name='video-library' size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='chats'
        options={{
          title: tx(4, 'Message'),
          tabBarIcon: ({ color }) => (
            <Ionicons name='chatbox-outline' size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          title: tx(5, 'Profile'),
          tabBarIcon: ({ color }) => (
            <Ionicons name='person-outline' size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
