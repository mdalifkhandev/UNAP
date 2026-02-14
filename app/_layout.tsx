import { getFCMToken, requestFCMPermission } from '@/services/fcm';
import { createNotificationChannel } from '@/services/notificationChannel';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { getApps } from '@react-native-firebase/app';
import {
  getInitialNotification,
  getMessaging,
  onMessage,
} from '@react-native-firebase/messaging';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import * as Notifications from 'expo-notifications';
import { router, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import './global.css';

import useThemeStore from '@/store/theme.store';
import { useColorScheme as useNWColorScheme } from 'nativewind';
import { useEffect, useState } from 'react';

export const unstable_settings = {
  anchor: '(tabs)',
};

if (getApps().length === 0) {
  // React Native Firebase is initialized natively in Expo dev/build.
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const RootLayout = () => {
  const { mode } = useThemeStore();
  const { setColorScheme } = useNWColorScheme();

  const islight = mode === 'light';
  const hasFirebaseApp = getApps().length > 0;

  useEffect(() => {
    setColorScheme(mode);
  }, [mode, setColorScheme]);

  useEffect(() => {
    async function setup() {
      try {
        if (!hasFirebaseApp) {
          console.log('Firebase app not initialized. Skipping FCM setup.');
          return;
        }
        await createNotificationChannel();
        const granted = await requestFCMPermission();
        if (!granted) {
          console.log('Notification permission denied');
          return;
        }
        await getFCMToken();
      } catch (error) {
        console.error('Firebase setup error:', error);
      }
    }
    setup();
  }, [hasFirebaseApp]);

  useEffect(() => {
    if (!hasFirebaseApp) return;
    try {
      const messaging = getMessaging();
      const unsubscribe = onMessage(messaging, async remoteMessage => {
        console.log('Foreground notification received:', remoteMessage);

        await Notifications.scheduleNotificationAsync({
          content: {
            title: remoteMessage.notification?.title || 'New Notification',
            body: remoteMessage.notification?.body || '',
            data: remoteMessage.data,
            sound: 'default',
          },
          trigger: null,
        });
      });
      return () => {
        unsubscribe();
      };
    } catch (error) {
      console.error('Foreground notification setup error:', error);
    }
  }, [hasFirebaseApp]);

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      response => {
        console.log('Notification interaction:', response);
        const screen = response.notification.request.content.data?.screen;
        if (typeof screen === 'string' && screen.length > 0) {
          router.push(screen as any);
        } else {
          router.push('/');
        }
      }
    );
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (!hasFirebaseApp) return;
    async function checkInitialNotification() {
      try {
        const messaging = getMessaging();
        const remoteMessage = await getInitialNotification(messaging);

        if (remoteMessage) {
          console.log(
            'App opened from killed state via notification:',
            remoteMessage
          );
          const screen = remoteMessage.data?.screen;
          if (typeof screen === 'string' && screen.length > 0) {
            router.push(screen as any);
          } else {
            router.push('/');
          }
        }
      } catch (error) {
        console.error('Initial notification check error:', error);
      }
    }

    checkInitialNotification();
  }, [hasFirebaseApp]);

  const [fontsLoaded] = useFonts({
    'Roboto-Bold': require('@/assets/fonts/Roboto-Bold.ttf'),
    'Roboto-SemiBold': require('@/assets/fonts/Roboto-SemiBold.ttf'),
    'Roboto-Medium': require('@/assets/fonts/Roboto-Medium.ttf'),
    'Roboto-Regular': require('@/assets/fonts/Roboto-Regular.ttf'),
    'Roboto-Thin': require('@/assets/fonts/Roboto-Thin.ttf'),
  });

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  const lightTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#FFFFFF',
      card: '#FFFFFF',
      text: '#000000',
      border: 'rgba(0,0,0,0.2)',
      primary: '#000000',
    },
  };

  const darkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: '#0B0F15',
      card: '#0B0F15',
      text: '#FFFFFF',
      border: '#292929',
      primary: '#FFFFFF',
    },
  };

  return (
    <ThemeProvider value={mode === 'light' ? lightTheme : darkTheme}>
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name='splash' options={{ headerShown: false }} />
          <Stack.Screen name='(auth)' />
          <Stack.Screen name='(tabs)' />
        </Stack>
      </QueryClientProvider>
      <StatusBar
        style={islight ? 'dark' : 'light'}
        backgroundColor={islight ? '#FFFFFF' : '#000000'}
      />
      <Toast />
    </ThemeProvider>
  );
};

export default RootLayout;
