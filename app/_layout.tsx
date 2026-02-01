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

import useThemeStore from '@/store/theme.store';
import { useColorScheme as useNWColorScheme } from 'nativewind';
import { useEffect, useState } from 'react';

export const unstable_settings = {
  anchor: '(tabs)',
};

const RootLayout = () => {
  const { mode } = useThemeStore();
  const { setColorScheme } = useNWColorScheme();

  useEffect(() => {
    setColorScheme(mode);
  }, [mode, setColorScheme]);

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
      <StatusBar style={mode === 'light' ? 'dark' : 'light'} />
      <Toast />
    </ThemeProvider>
  );
};

export default RootLayout;
