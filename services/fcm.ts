import { NativeModules } from 'react-native';
import { getExpoNotificationsModule, isExpoGoRuntime } from './expoNotifications';

export type RemoteMessage = {
  messageId?: string;
  sentTime?: number;
  notification?: {
    title?: string;
    body?: string;
  };
  data?: Record<string, string>;
};

type MessagingModule = {
  AuthorizationStatus: {
    AUTHORIZED: number;
    PROVISIONAL: number;
  };
  getMessaging: () => unknown;
  getToken: (messaging: unknown) => Promise<string>;
  requestPermission: (messaging: unknown) => Promise<number>;
  onMessage: (
    messaging: unknown,
    listener: (message: RemoteMessage) => void | Promise<void>,
  ) => () => void;
  getInitialNotification: (messaging: unknown) => Promise<RemoteMessage | null>;
};

function getFirebaseMessagingModule(): MessagingModule | null {
  try {
    if (!NativeModules?.RNFBAppModule) {
      return null;
    }

    // Lazy-load so Expo Go doesn't crash when native module doesn't exist.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const app = require('@react-native-firebase/app');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const messaging = require('@react-native-firebase/messaging');

    const apps = app.getApps?.() || [];
    if (!Array.isArray(apps) || apps.length === 0) {
      return null;
    }

    return messaging as MessagingModule;
  } catch {
    return null;
  }
}

export function isFirebaseMessagingAvailable() {
  return !!getFirebaseMessagingModule();
}

export async function requestFCMPermission() {
  const messagingModule = getFirebaseMessagingModule();
  if (!messagingModule) {
    console.log('Firebase native module unavailable. Skipping FCM permission request.');
    return false;
  }

  const notifications = getExpoNotificationsModule();
  if (!notifications) {
    console.log('expo-notifications unavailable in current runtime.');
    return false;
  }

  const messaging = messagingModule.getMessaging();
  await notifications.requestPermissionsAsync();
  const authStatus = await messagingModule.requestPermission(messaging);
  const enabled =
    authStatus === messagingModule.AuthorizationStatus.AUTHORIZED ||
    authStatus === messagingModule.AuthorizationStatus.PROVISIONAL;
  return enabled;
}

export async function getFCMToken() {
  if (isExpoGoRuntime()) {
    return null;
  }

  const messagingModule = getFirebaseMessagingModule();
  if (!messagingModule) {
    console.log('Firebase native module unavailable. FCM token unavailable.');
    return null;
  }

  const messaging = messagingModule.getMessaging();
  const token = await messagingModule.getToken(messaging);
  console.log('FCM Token', token);
  return token;
}

export function subscribeForegroundFCM(
  listener: (message: RemoteMessage) => void | Promise<void>,
) {
  const messagingModule = getFirebaseMessagingModule();
  if (!messagingModule) {
    return () => {};
  }

  const messaging = messagingModule.getMessaging();
  return messagingModule.onMessage(messaging, listener);
}

export async function getInitialFCMNotification() {
  const messagingModule = getFirebaseMessagingModule();
  if (!messagingModule) {
    return null;
  }

  const messaging = messagingModule.getMessaging();
  return messagingModule.getInitialNotification(messaging);
}
