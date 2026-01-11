import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import './global.css';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useState } from 'react';

export const unstable_settings = {
  anchor: '(tabs)',
};

const RootLayout = () => {
  const colorScheme = useColorScheme();

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

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name='splash' options={{ headerShown: false }} />
          <Stack.Screen name='(auth)' />
          <Stack.Screen name='(tabs)' />
        </Stack>
      </QueryClientProvider>
      <StatusBar style='light' />
      <Toast />
    </ThemeProvider>
  );
};

export default RootLayout;
