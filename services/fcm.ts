import { getApps } from '@react-native-firebase/app';
import {
  AuthorizationStatus,
  getMessaging,
  getToken,
  requestPermission,
} from '@react-native-firebase/messaging';
import * as Notifications from 'expo-notifications';

export async function requestFCMPermission() {
  if (getApps().length === 0) {
    console.log('Firebase app is not initialized. Skipping FCM permission request.');
    return false;
  }
  const messaging = getMessaging();
  await Notifications.requestPermissionsAsync();
  const authStatus = await requestPermission(messaging);
  const enabled =
    authStatus === AuthorizationStatus.AUTHORIZED ||
    authStatus === AuthorizationStatus.PROVISIONAL;
  return enabled;
}

export async function getFCMToken() {
  if (getApps().length === 0) {
    console.log('Firebase app is not initialized. FCM token unavailable.');
    return null;
  }
  const messaging = getMessaging();
  const token = await getToken(messaging);
  console.log('FCM Token', token);
  return token;
}
