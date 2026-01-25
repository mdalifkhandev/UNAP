import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import { View } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FFFFFF',
        // tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: '#000000',
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
            <MaterialCommunityIcons name="chart-timeline-variant-shimmer" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='create'
        options={{
          title: '',
          tabBarIconStyle: {
            width: 0,
            height: 60,
          },
          tabBarIcon: ({ color }) => (
            <View className='h-14 w-14 bg-[#1E293B] rounded-full flex-row justify-center items-center'>
              <Feather name='plus-square' size={22} color={color} />
            </View>
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
