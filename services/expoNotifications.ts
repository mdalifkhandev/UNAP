import Constants from 'expo-constants';

type ExpoNotificationsModule = typeof import('expo-notifications');

let cachedModule: ExpoNotificationsModule | null | undefined;

export function isExpoGoRuntime() {
  return Constants.appOwnership === 'expo';
}

export function getExpoNotificationsModule(): ExpoNotificationsModule | null {
  if (isExpoGoRuntime()) return null;
  if (cachedModule !== undefined) return cachedModule;

  try {
    // Use runtime require so Expo Go does not load expo-notifications module.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    cachedModule = require('expo-notifications') as ExpoNotificationsModule;
  } catch {
    cachedModule = null;
  }

  return cachedModule;
}
