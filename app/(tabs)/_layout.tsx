import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
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
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <Ionicons name='home-outline' size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='trending'
        options={{
          title: 'Trending',
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
          title: 'Post',
          tabBarIcon: ({ color }) => (
            <Feather name='plus-square' size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='uclips'
        options={{
          title: 'UClips',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name='video-library' size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='chats'
        options={{
          title: 'Message',
          tabBarIcon: ({ color }) => (
            <Ionicons name='chatbox-outline' size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <Ionicons name='person-outline' size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
