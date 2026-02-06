import ShadowButton from '@/components/button/ShadowButton';
import Input from '@/components/inpute/Inpute';
import GradientBackground from '@/components/main/GradientBackground';
import {
  useConnectAccount,
  useDisconnectAccount,
  useGetAccounts,
} from '@/hooks/app/accounts';
import { useCompleteProfile, useGetMyProfile } from '@/hooks/app/profile';
import { useTranslateTexts } from '@/hooks/app/translate';
import { getShortErrorMessage } from '@/lib/error';
import Feather from '@expo/vector-icons/Feather';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import * as WebBrowser from 'expo-web-browser';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

const CompleteProfile = () => {
  const [roleOpen, setRoleOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState('Singer');

  const roles = ['Singer', 'Dancer', 'Actor', 'Model', 'Photographer'];

  // form state
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [instagram, setInstagram] = useState('');
  const [youtube, setYoutube] = useState('');
  const [spotify, setSpotify] = useState('');

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [connectingPlatform, setConnectingPlatform] = useState<string | null>(
    null
  );

  const { data: profileData } = useGetMyProfile();
  // @ts-ignore
  const profile = profileData?.profile;
  const { mutate: completeProfile, isPending: loading } = useCompleteProfile();
  const { data: accountsData, refetch: refetchAccounts } = useGetAccounts();
  const { mutateAsync: connectAccount } = useConnectAccount();
  const { mutateAsync: disconnectAccount } = useDisconnectAccount();
  const { data: t } = useTranslateTexts({
    texts: [
      'Complete Your Profile',
      'Let other artists know more about you',
      'Upload Photo',
      'Username',
      'Display Name',
      'Select Your Role',
      'Bio',
      'Connect Instagram',
      'Connect YouTube',
      'Connect TikTok',
      'Connect Facebook',
      'Connect Twitter',
      'Connect Spotify',
      'Complete Setup',
      'Write something...',
      'Tell us about yourself and your music...',
      'Connected',
      'Disconnect',
      'Connecting...',
    ],
    targetLang: profile?.preferredLanguage,
    enabled: !!profile?.preferredLanguage,
  });
  const tx = (i: number, fallback: string) =>
    t?.translations?.[i] || fallback;

  const connectedPlatforms = new Set(
    (accountsData?.accounts || []).map((acc: any) => acc.platform)
  );

  const isConnected = (platform: string) =>
    connectedPlatforms.has(platform);

  const handleConnectPlatform = async (platform: string) => {
    try {
      setConnectingPlatform(platform);
      if (isConnected(platform)) {
        await disconnectAccount(platform);
        await refetchAccounts();
        Toast.show({
          type: 'success',
          text1: tx(16, 'Disconnect'),
          text2: `${platform} disconnected.`,
        });
        return;
      }

      const res = await connectAccount({ platform });
      const url = res?.authUrl || res?.url;
      if (!url) {
        throw new Error('Missing authorization URL');
      }
      await WebBrowser.openBrowserAsync(url);
      await refetchAccounts();
      Toast.show({
        type: 'success',
        text1: tx(17, 'Connected'),
        text2: `${platform} connected.`,
      });
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Connection Failed',
        text2: getShortErrorMessage(err, 'Please try again.'),
      });
    } finally {
      setConnectingPlatform(null);
    }
  };

  useEffect(() => {
    if (profile) {
      setUsername(profile.username || '');
      setDisplayName(profile.displayName || '');
      setBio(profile.bio || '');
      if (profile.role) {
        const capitalizedRole =
          profile.role.charAt(0).toUpperCase() + profile.role.slice(1);
        if (roles.includes(capitalizedRole)) {
          setSelectedRole(capitalizedRole);
        }
      }
      setInstagram(profile.instagramUrl || '');
      setYoutube(profile.youtubeUrl || '');
      setSpotify(profile.spotifyArtistUrl || '');
      if (profile.profileImageUrl) {
        setProfileImage(profile.profileImageUrl);
      }
    }
  }, [profile]);

  // Helper function to format URLs properly
  const formatUrl = (url: string, platform?: string) => {
    if (!url || url.trim() === '') return '';
    const trimmed = url.trim();

    // If it already starts with http:// or https://, return as is
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed;
    }

    // Handle @ prefix (remove it before adding domain)
    const cleanUrl = trimmed.startsWith('@') ? trimmed.slice(1) : trimmed;

    // If it's just a username without domain, add the platform domain
    if (platform === 'instagram' && !cleanUrl.includes('.')) {
      return `https://instagram.com/${cleanUrl}`;
    }
    if (platform === 'youtube' && !cleanUrl.includes('.')) {
      return `https://youtube.com/@${cleanUrl}`;
    }
    if (platform === 'spotify' && !cleanUrl.includes('.')) {
      return `https://open.spotify.com/artist/${cleanUrl}`;
    }

    // Otherwise, add https://
    return `https://${cleanUrl}`;
  };

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.status !== 'granted') {
      setErrorMsg('Permission to access media library is required.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setProfileImage(uri);
      setErrorMsg(null);
    }
  };

  const handleCompleteProfile = async () => {
    if (!profileImage) {
      setErrorMsg('Profile image is required.');
      return;
    }

    setErrorMsg(null);

    try {
      const formData = new FormData();

      // profileImage (required)
      // If it's a new local image
      if (profileImage && !profileImage.startsWith('http')) {
        const filename = profileImage.split('/').pop() || 'profile.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const ext = match?.[1]?.toLowerCase() || 'jpg';
        const mimeType =
          ext === 'png'
            ? 'image/png'
            : ext === 'jpeg' || ext === 'jpg'
              ? 'image/jpeg'
              : 'image/*';

        formData.append('profileImage', {
          uri: profileImage,
          name: filename,
          type: mimeType,
        } as any);
      }

      // other fields
      formData.append('username', username);
      formData.append('role', selectedRole.toLowerCase());
      formData.append('bio', bio);
      formData.append('displayName', displayName);

      // Format URLs properly
      formData.append('instagramUrl', formatUrl(instagram, 'instagram'));
      formData.append('youtubeUrl', formatUrl(youtube, 'youtube'));
      formData.append('spotifyArtistUrl', formatUrl(spotify, 'spotify'));

      // optional socials
      formData.append('tiktokUrl', '');
      formData.append('facebookUrl', '');

      completeProfile(formData, {
        onSuccess: () => {
          router.push('/(tabs)/profile');
        },
        onError: (error: any) => {
          const errorResponse = error?.response?.data;
          if (errorResponse?.error === 'Profile already completed.') {
            router.push('/(tabs)/profile');
            return;
          }
          setErrorMsg(
            errorResponse?.error ||
              error?.message ||
              'Something went wrong. Please try again.'
          );
        },
      });
    } catch (error: any) {
      setErrorMsg(error?.message || 'Failed to prepare data');
    }
  };

  return (
    <GradientBackground>
      <SafeAreaView className='flex-1' edges={['top', 'left', 'right']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            {/* headers */}
            <View className='mx-6 mt-10'>
              <Text className='font-roboto-bold text-primary dark:text-white text-2xl text-center flex-1'>
                {tx(0, 'Complete Your Profile')}
              </Text>
              <Text className='font-roboto-regular text-secondary dark:text-white/80 text-center flex-1'>
                {tx(1, 'Let other artists know more about you')}
              </Text>
            </View>

            {/* profile image */}
            <View className='items-center mt-6'>
              <View className='relative'>
                <TouchableOpacity onPress={pickImage}>
                  {profileImage ? (
                    <Image
                      source={{ uri: profileImage }}
                      style={{ width: 100, height: 100, borderRadius: 100 }}
                      contentFit='cover'
                    />
                  ) : (
                    <View
                      style={{
                        width: 100,
                        height: 100,
                        borderRadius: 100,
                        backgroundColor: '#F0F2F5',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderWidth: 1,
                        borderColor: 'rgba(0,0,0,0.2)',
                      }}
                    >
                      <Feather name='camera' size={30} color='rgba(0,0,0,0.5)' />
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </View>
            <Text className='text-primary dark:text-white text-xl font-roboto-semibold text-center mt-3'>
              {tx(2, 'Upload Photo')}
            </Text>

            {/* input fields */}
            <View className='mx-6 mt-6'>
              {/* Username */}
              <Text className='text-primary dark:text-white'>Username</Text>
              <Input
                className='mt-2'
                placeholder='@yourhandle'
                value={username}
                onChangeText={setUsername}
              />

              {/* Display Name */}
              <Text className='text-primary dark:text-white mt-3'>Display Name</Text>
              <Input
                className='mt-2'
                placeholder='Rokey Mahmud'
                value={displayName}
                onChangeText={setDisplayName}
              />

              {/* Select Your Role */}
              <Text className='text-primary dark:text-white mb-2 mt-3 text-base'>
                {tx(5, 'Select Your Role')}
              </Text>
              <Input
                className='mt-2'
                placeholder='Rokey Mahmud'
                value={selectedRole}
                onChangeText={setSelectedRole}
              />
              {/* <View className='w-full'>
                <TouchableOpacity
                  onPress={() => setRoleOpen(!roleOpen)}
                  className='w-full bg-[#F0F2F5] dark:bg-[#FFFFFF0D] border border-black/20 dark:border-[#FFFFFF0D] dark:border-[#FFFFFF0D] rounded-xl p-4 flex-row justify-between items-center'
                >
                  <Text className='text-gray-200 text-base'>
                    {selectedRole}
                  </Text>
                  <Feather
                    name={roleOpen ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color='#fff'
                  />
                </TouchableOpacity>

                {roleOpen && (
                  <View className='mt-1 bg-[#121212] rounded-xl border border-gray-700'>
                    {roles.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          setSelectedRole(item);
                          setRoleOpen(false);
                        }}
                        className='p-4 border-b border-gray-800'
                      >
                        <Text className='text-gray-200'>{item}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View> */}

              {/* Bio */}
              <Text className='text-primary dark:text-white mt-3 mb-2 text-base'>Bio</Text>
              <TextInput
                placeholder={tx(15, 'Tell us about yourself and your music...')}
                placeholderTextColor='rgba(0,0,0,0.5)'
                multiline
                numberOfLines={4}
                className='bg-[#F0F2F5] dark:bg-[#FFFFFF0D] border border-black/20 dark:border-[#FFFFFF0D] rounded-xl p-4 text-primary dark:text-white'
                style={{ textAlignVertical: 'top' }}
                value={bio}
                onChangeText={setBio}
              />

              {/* Instagram */}
              <ShadowButton
                text={
                  connectingPlatform === 'instagram'
                    ? tx(18, 'Connecting...')
                    : isConnected('instagram')
                      ? `${tx(16, 'Connected')} Instagram`
                      : tx(7, 'Connect Instagram')
                }
                textColor='black'
                backGroundColor='gray'
                onPress={() => handleConnectPlatform('instagram')}
                className='mt-8 mx-6'
              />

              {/* YouTube */}
              <ShadowButton
                text={
                  connectingPlatform === 'youtube'
                    ? tx(18, 'Connecting...')
                    : isConnected('youtube')
                      ? `${tx(16, 'Connected')} YouTube`
                      : tx(8, 'Connect YouTube')
                }
                textColor='black'
                backGroundColor='gray'
                onPress={() => handleConnectPlatform('youtube')}
                className='mt-8 mx-6'
              />

              {/* TikTok */}
              <ShadowButton
                text={
                  connectingPlatform === 'tiktok'
                    ? tx(18, 'Connecting...')
                    : isConnected('tiktok')
                      ? `${tx(16, 'Connected')} TikTok`
                      : tx(9, 'Connect TikTok')
                }
                textColor='black'
                backGroundColor='gray'
                onPress={() => handleConnectPlatform('tiktok')}
                className='mt-8 mx-6'
              />

              {/* Facebook */}
              <ShadowButton
                text={
                  connectingPlatform === 'facebook'
                    ? tx(18, 'Connecting...')
                    : isConnected('facebook')
                      ? `${tx(16, 'Connected')} Facebook`
                      : tx(10, 'Connect Facebook')
                }
                textColor='black'
                backGroundColor='gray'
                onPress={() => handleConnectPlatform('facebook')}
                className='mt-8 mx-6'
              />

              {/* Twitter */}
              <ShadowButton
                text={
                  connectingPlatform === 'twitter'
                    ? tx(18, 'Connecting...')
                    : isConnected('twitter')
                      ? `${tx(16, 'Connected')} Twitter`
                      : tx(11, 'Connect Twitter')
                }
                textColor='black'
                backGroundColor='gray'
                onPress={() => handleConnectPlatform('twitter')}
                className='mt-8 mx-6'
              />

              {/* Spotify */}
              <ShadowButton
                text={
                  connectingPlatform === 'spotify'
                    ? tx(18, 'Connecting...')
                    : isConnected('spotify')
                      ? `${tx(16, 'Connected')} Spotify`
                      : tx(12, 'Connect Spotify')
                }
                textColor='black'
                backGroundColor='gray'
                onPress={() => handleConnectPlatform('spotify')}
                className='mt-8 mx-6'
              />
            </View>

            <View className='pb-8'>
              {errorMsg ? (
                <Text className='text-red-400 text-center mt-4 mx-6'>
                  {errorMsg}
                </Text>
              ) : null}

              <ShadowButton
                text={loading ? 'Saving...' : tx(13, 'Complete Setup')}
                textColor='#2B2B2B'
                backGroundColor='#E8EBEE'
                onPress={handleCompleteProfile}
                className='mt-8 mx-6'
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default CompleteProfile;
