import { AccessToken, LoginManager } from 'react-native-fbsdk-next';
import { NativeModules, Platform } from 'react-native';

type AuthChangeHandler = (user: any | null) => void;
type OAuthProviderId = 'google.com' | 'twitter.com';

type FirebaseAuthModules = {
  authInstance: any;
  OAuthProvider: any;
  onAuthStateChanged: (auth: any, handler: AuthChangeHandler) => () => void;
  signInWithPopup?: (auth: any, provider: any) => Promise<any>;
  signInWithCredential?: (auth: any, credential: any) => Promise<any>;
  FacebookAuthProvider?: any;
  signOut: (auth: any) => Promise<void>;
};

function getFirebaseAuthModules(): FirebaseAuthModules | null {
  if (Platform.OS === 'web') return null;
  if (!NativeModules?.RNFBAppModule) return null;

  try {
    const app = require('@react-native-firebase/app');
    const auth = require('@react-native-firebase/auth');
    const authInstance = auth.getAuth(app.getApp());

    return {
      authInstance,
      OAuthProvider: auth.OAuthProvider,
      onAuthStateChanged: auth.onAuthStateChanged,
      signInWithPopup: auth.signInWithPopup,
      signInWithCredential: auth.signInWithCredential,
      FacebookAuthProvider: auth.FacebookAuthProvider,
      signOut: auth.signOut,
    };
  } catch {
    return null;
  }
}

function getUnavailableMessage() {
  if (Platform.OS === 'web') {
    return 'Social login requires Android/iOS native build.';
  }
  return 'Firebase native module unavailable. Rebuild and reinstall app using development build (npx expo run:android / npx expo run:ios).';
}

function buildProvider(modules: FirebaseAuthModules, providerId: OAuthProviderId) {
  const provider = new modules.OAuthProvider(providerId);

  if (providerId === 'google.com') {
    provider.addScope('email');
    provider.addScope('profile');
    provider.setCustomParameters({ prompt: 'select_account' });
  }

  return provider;
}

async function signInWithOAuthProvider(providerId: OAuthProviderId) {
  const modules = getFirebaseAuthModules();
  if (!modules) {
    throw new Error(getUnavailableMessage());
  }

  if (typeof modules.signInWithPopup !== 'function') {
    throw new Error('This build does not support Firebase popup login. Use native provider flow/dev client.');
  }

  const provider = buildProvider(modules, providerId);
  return modules.signInWithPopup(modules.authInstance, provider);
}

export function observeAuthState(handler: AuthChangeHandler) {
  const modules = getFirebaseAuthModules();
  if (!modules) {
    console.log('Firebase native module unavailable. Skipping auth state observer.');
    return () => {};
  }

  return modules.onAuthStateChanged(modules.authInstance, handler);
}

export async function signOutCurrentUser() {
  const modules = getFirebaseAuthModules();
  if (!modules) return;

  await modules.signOut(modules.authInstance);
  try {
    LoginManager.logOut();
  } catch {
    // ignore facebook logout errors
  }
}

export async function signInWithGoogle() {
  return signInWithOAuthProvider('google.com');
}

export async function signInWithFacebook() {
  const modules = getFirebaseAuthModules();
  if (!modules) {
    throw new Error(getUnavailableMessage());
  }

  if (
    typeof modules.signInWithCredential !== 'function' ||
    !modules.FacebookAuthProvider
  ) {
    throw new Error(
      'Firebase credential sign-in is unavailable in this build. Rebuild app with native modules.'
    );
  }

  const loginResult = await LoginManager.logInWithPermissions([
    'public_profile',
    'email',
  ]);

  if (loginResult.isCancelled) {
    throw new Error('Facebook login cancelled.');
  }

  const tokenData = await AccessToken.getCurrentAccessToken();
  const fbToken = tokenData?.accessToken?.toString?.() || tokenData?.accessToken;

  if (!fbToken) {
    throw new Error('Failed to get Facebook access token.');
  }

  const credential = modules.FacebookAuthProvider.credential(fbToken);
  return modules.signInWithCredential(modules.authInstance, credential);
}

export async function signInWithTwitter() {
  return signInWithOAuthProvider('twitter.com');
}
