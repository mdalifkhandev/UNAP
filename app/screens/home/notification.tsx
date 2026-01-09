import BackButton from '@/components/button/BackButton';
import NotificationCard from '@/components/card/NotificationCard';
import NotificationUpFollowCard from '@/components/card/NotificationUpFollowCard';
import GradientBackground from '@/components/main/GradientBackground';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Notification = () => {
  const img1 = require('@/assets/images/profile.png');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Handle menu toggle
  const handleMenuToggle = (id: string) => {
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  // Handle menu close
  const handleMenuClose = () => {
    setActiveMenuId(null);
  };

  // ✅ Dummy notification data
  const notifications = [
    {
      id: '1',
      name: 'Sarah Martinez',
      reson: 'Liked Your Post',
      time: '2 minute ago',
      img: img1,
      type: 'like',
    },
    {
      id: '2',
      name: 'Sarah Martinez',
      reson: 'started following you',
      time: '5 minute ago',
      img: img1,
      type: 'follow',
    },
    {
      id: '3',
      name: 'Luna Voice',
      reson: "You've reached 10,000 followers! 🎉",
      time: '10 minute ago',
      img: img1,
      type: '10000',
    },
    {
      id: '4',
      name: 'Sarah Martinez',
      reson: 'Liked Your Post',
      time: '15 minute ago',
      img: img1,
      type: 'like',
    },
    {
      id: '5',
      name: 'Sarah Martinez',
      reson: 'Liked Your Post',
      time: '20 minute ago',
      img: img1,
      type: 'like',
    },
  ];

  return (
    <GradientBackground>
      <SafeAreaView className='flex-1 mt-2.5' edges={['top', 'left', 'right']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          {/* Header */}
          <View className='flex-row mt-4 mx-6'>
            <BackButton />
            <Text className='text-primary font-roboto-bold text-2xl text-center flex-1'>
              Notification
            </Text>
          </View>

          <View className='border-b border-[#292929] w-full mt-2' />

          {/* Notification List */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 72, marginHorizontal: 24 }}
          >
            {notifications.map(item => {
              if (item.type === '10000') {
                return (
                  <NotificationUpFollowCard
                    key={item.id}
                    name={item.name}
                    reson={item.reson}
                    time={item.time}
                    img={item.img}
                    className='mt-3'
                    type={item.type}
                  />
                );
              }

              return (
                <NotificationCard
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  reson={item.reson}
                  time={item.time}
                  img={item.img}
                  className='mt-3'
                  type={item.type as 'like' | 'follow'}
                  showMenu={activeMenuId === item.id}
                  onMenuToggle={handleMenuToggle}
                  onMenuClose={handleMenuClose}
                />
              );
            })}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default Notification;
