import { getApp } from '@react-native-firebase/app';
import {
  getAuth,
  OAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from '@react-native-firebase/auth';
import { Platform } from 'react-native';

type AuthChangeHandler = (user: any | null) => void;
type OAuthProviderId = 'google.com' | 'facebook.com' | 'twitter.com';

function assertNativePlatform() {
  if (Platform.OS === 'web') {
    throw new Error('Social login requires Android or iOS native build.');
  }
}

function getNativeAuth() {
  return getAuth(getApp());
}

function buildProvider(providerId: OAuthProviderId) {
  const provider = new OAuthProvider(providerId);

  if (providerId === 'google.com') {
    provider.addScope('email');
    provider.addScope('profile');
    provider.setCustomParameters({ prompt: 'select_account' });
  }

  if (providerId === 'facebook.com') {
    provider.addScope('email');
  }

  return provider;
}

async function signInWithOAuthProvider(providerId: OAuthProviderId) {
  assertNativePlatform();
  const provider = buildProvider(providerId);
  return signInWithPopup(getNativeAuth(), provider);
}

export function observeAuthState(handler: AuthChangeHandler) {
  return onAuthStateChanged(getNativeAuth(), handler);
}

export async function signOutCurrentUser() {
  await signOut(getNativeAuth());
}

export async function signInWithGoogle() {
  return signInWithOAuthProvider('google.com');
}

export async function signInWithFacebook() {
  return signInWithOAuthProvider('facebook.com');
}

export async function signInWithTwitter() {
  return signInWithOAuthProvider('twitter.com');
}
