import ShadowButton from '@/components/button/ShadowButton';
import GradientBackground from '@/components/main/GradientBackground';
import { useGetMyProfile } from '@/hooks/app/profile';
import useAuthStore from '@/store/auth.store';
import Feather from '@expo/vector-icons/Feather';
import Foundation from '@expo/vector-icons/Foundation';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const VideoGridItem = ({ uri }: { uri: string }) => {
  const player = useVideoPlayer(uri, player => {
    player.muted = true;
    player.loop = true;
    player.play();
  });

  return (
    <VideoView
      style={{ width: '100%', height: '100%' }}
      player={player}
      nativeControls={false}
      contentFit='cover'
    />
  );
};

const Profiles = () => {
  const { user } = useAuthStore();

  const { data } = useGetMyProfile();
  // @ts-ignore
  const profile = data?.profile;

  console.log('prifile', profile);
// ... existing state and logic ...
  // Selected post type state
  const [selectedType, setSelectedType] = useState<'photo' | 'video' | 'music'>(
    'photo'
  );

  // Map API posts to the format used in render
  const displayPosts =
    selectedType === 'photo'
      ? profile?.imagePosts || []
      : selectedType === 'video'
        ? profile?.videoPosts || []
        : profile?.audioPosts || [];

  return (
    <GradientBackground>
      <SafeAreaView className='flex-1' edges={['top', 'left', 'right']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          {/* headers */}
          <View className='mt-3 flex-row items-center mx-6 justify-between'>
            <Text className='font-roboto-bold text-primary text-2xl text-center flex-1'>
              Profile
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/screens/profile/settings/settings')}
            >
              <Ionicons name='settings-outline' size={24} color='white' />
            </TouchableOpacity>
          </View>

          <View className='border-b border-[#292929] w-full mt-2'></View>

          <ScrollView
            contentContainerStyle={{ paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
          >
            {/* profile picture */}
            <View className='flex-row gap-4 mt-4 items-center mx-6'>
              <TouchableOpacity className='mt-2'>
                <Image
                  source={{
                    uri:
                      profile?.profileImageUrl ||
                      'https://randomuser.me/api/portraits/men/44.jpg',
                  }}
                  style={{ width: 100, height: 100, borderRadius: 100 }}
                  contentFit='cover'
                />
              </TouchableOpacity>
              <View>
                <Text className='text-primary font-roboto-bold text-2xl'>
                  {profile?.displayName || user?.name || 'User'}
                </Text>
                <Text className='text-primary font-roboto-regular text-lg'>
                  {profile?.role || 'User'}
                </Text>
              </View>
            </View>

            {/* details */}
            <View className='mt-3 mx-6'>
              <Text className='font-roboto-medium text-primary'>
                {profile?.bio || 'No bio yet'}
              </Text>
            </View>

            {/* border */}
            <View className='border-b border-[#292929] w-full my-3 mx-6'></View>

            {/* post stats */}
            <View className='flex-row justify-between items-center mt-3 py-3 mx-6'>
              <View>
                <Text className='text-primary text-center font-roboto-semibold text-2xl'>
                  {profile?.postsCount || 0}
                </Text>
                <Text className='text-secondary text-center font-roboto-regular text-lg'>
                  Posts
                </Text>
              </View>
              <View>
                <Text className='text-primary text-center font-roboto-semibold text-2xl'>
                  {profile?.followersCount || 0}
                </Text>
                <Text className='text-secondary text-center font-roboto-regular text-lg'>
                  Followers
                </Text>
              </View>
              <View>
                <Text className='text-primary text-center font-roboto-semibold text-2xl'>
                  {profile?.followingCount || 0}
                </Text>
                <Text className='text-secondary text-center font-roboto-regular text-lg'>
                  Following
                </Text>
              </View>
            </View>

            {/* border */}
            <View className='border-b border-[#292929] w-full my-3 mx-6'></View>

            {/* edit/share buttons */}
            <View className='flex-row justify-center items-center gap-5 mx-6'>
              <ShadowButton
                text='Edit Profile'
                textColor='#2B2B2B'
                backGroundColor='#E8EBEE'
                onPress={() => router.push('/screens/profile/edit-profile')}
                className='mt-4'
              />
              <ShadowButton
                text='Share Profile'
                textColor='#E6E6E6'
                backGroundColor='#000000'
                onPress={() => router.push('/(tabs)/home')}
                className='mt-4 border border-[#E6E6E6]'
              />
            </View>

            {/* border */}
            <View className='border-b border-[#292929] w-full mt-24 mx-6'></View>

            {/* post filter buttons */}
            <View className='flex-row justify-between items-center gap-6 mt-3 mx-6'>
              {['photo', 'video', 'music'].map(type => {
                const Icon = type === 'photo' ? Foundation : Feather;
                const iconName =
                  type === 'photo'
                    ? 'photo'
                    : type === 'video'
                      ? 'video'
                      : 'music';
                return (
                  <TouchableOpacity
                    key={type}
                    onPress={() =>
                      setSelectedType(type as 'photo' | 'video' | 'music')
                    }
                    className={`px-5 py-4 rounded-lg flex-row gap-2 items-center ${
                      selectedType === type ? 'bg-[#444]' : 'bg-transparent'
                    }`}
                  >
                    <Icon name={iconName as any} size={24} color='white' />
                    <Text className='text-primary font-roboto-regular mt-1'>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* post data */}
            <View className='flex-row flex-wrap mt-3 mx-6'>
              {displayPosts.length > 0 ? (
                displayPosts.map((item: any) => (
                  <View key={item._id} className='w-1/3 border border-white'>
                    {selectedType === 'photo' && (
                      <Image
                        source={{ uri: item.mediaUrl }}
                        style={{
                          width: '100%',
                          height: 130,
                          borderWidth: 1,
                          borderColor: 'white',
                        }}
                        contentFit='cover'
                      />
                    )}
                    {selectedType === 'video' && (
                      <View style={{ width: '100%', height: 130, padding: 2 }}>
                        <VideoGridItem uri={item.mediaUrl} />
                        <View className='absolute inset-0 items-center justify-center'>
                          <Feather
                            name='video'
                            size={24}
                            color='white'
                            opacity={0.7}
                          />
                        </View>
                      </View>
                    )}
                    {selectedType === 'music' && (
                      <View className='p-4 bg-[#292929] items-center justify-center w-full aspect-square'>
                        <Feather name='music' size={40} color='#F54900' />
                        <Text className='text-white mt-2 text-center text-xs'>
                          {item.description || 'Audio File'}
                        </Text>
                      </View>
                    )}
                  </View>
                ))
              ) : (
                <Text className='text-primary font-roboto-regular mt-1'>
                  No {selectedType} posts found
                </Text>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default Profiles;
