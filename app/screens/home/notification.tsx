import BackButton from '@/components/button/BackButton';
import NotificationCard from '@/components/card/NotificationCard';
import GradientBackground from '@/components/main/GradientBackground';
import { useTranslateTexts } from '@/hooks/app/translate';
import useLanguageStore from '@/store/language.store';
import useNotificationStore from '@/store/notification.store';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function formatRelativeTime(iso: string) {
  const time = new Date(iso).getTime();
  if (Number.isNaN(time)) return 'Just now';
  const diffMs = Date.now() - time;
  const diffMin = Math.max(0, Math.floor(diffMs / 60000));

  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;

  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;

  const diffDay = Math.floor(diffHour / 24);
  return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
}

const Notification = () => {
  const img1 = require('@/assets/images/profile.png');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const { notifications, markAsRead, resetBadgeCount, removeNotification } =
    useNotificationStore();
  const { language } = useLanguageStore();
  const { data: t } = useTranslateTexts({
    texts: [
      'Notification',
      'No notifications yet.',
    ],
    targetLang: language,
    enabled: !!language && language !== 'EN',
  });
  const tx = (i: number, fallback: string) =>
    t?.translations?.[i] || fallback;

  const handleMenuToggle = (id: string) => {
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  const handleMenuClose = () => {
    setActiveMenuId(null);
  };

  useFocusEffect(
    useCallback(() => {
      resetBadgeCount();
    }, [resetBadgeCount])
  );

  const mappedNotifications = useMemo(
    () =>
      notifications.map(item => ({
        id: item.id,
        name: item.title || 'Notification',
        reson: item.body || '',
        time: formatRelativeTime(item.createdAt),
        img: img1,
        type:
          item.type === 'follow'
            ? 'follow'
            : item.type === 'chat'
            ? 'chat'
            : item.type === 'comment'
            ? 'comment'
            : 'like',
        isRead: item.read,
        userId:
          typeof item.data?.actorUserId === 'string'
            ? item.data.actorUserId
            : typeof item.data?.senderId === 'string'
            ? item.data.senderId
            : undefined,
        postId:
          typeof item.data?.postId === 'string' ? item.data.postId : undefined,
        screen: typeof item.screen === 'string' ? item.screen : undefined,
      })),
    [notifications, img1]
  );

  const handleOpenNotification = (item: (typeof mappedNotifications)[number]) => {
    markAsRead(item.id);

    if (item.type === 'chat' && item.userId) {
      router.push({
        pathname: '/screens/chat/chat-screen',
        params: {
          userId: item.userId,
          receiverId: item.userId,
        },
      });
      return;
    }

    if ((item.type === 'like' || item.type === 'comment') && item.postId) {
      router.push({
        pathname: '/screens/home/post-detail',
        params: { postId: item.postId },
      });
      return;
    }

    if (item.screen) {
      router.push(item.screen as any);
    }
  };

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
              {tx(0, 'Notification')}
            </Text>
          </View>

          <View className='border-b border-black/20 dark:border-[#FFFFFF0D] dark:border-[#292929] w-full mt-2' />

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 72, marginHorizontal: 24 }}
            onScrollBeginDrag={handleMenuClose}
          >
            {mappedNotifications.length === 0 ? (
              <Text className='mt-6 text-center text-primary dark:text-white font-roboto-regular text-base'>
                {tx(1, 'No notifications yet.')}
              </Text>
            ) : (
              mappedNotifications.map(item => (
                <NotificationCard
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  reson={item.reson}
                  time={item.time}
                  img={item.img}
                  className='mt-3'
                  type={item.type as 'like' | 'comment' | 'follow' | 'chat'}
                  isRead={item.isRead}
                  showMenu={activeMenuId === item.id}
                  onMenuToggle={handleMenuToggle}
                  onMenuClose={handleMenuClose}
                  onMarkAsRead={markAsRead}
                  onDelete={removeNotification}
                  userId={item.userId}
                  onPress={() => handleOpenNotification(item)}
                />
              ))
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default Notification;
