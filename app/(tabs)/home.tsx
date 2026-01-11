import OfficePostCard from '@/components/card/OfficePostCard';
import PostCard from '@/components/card/PostCard';
import SuggestedArtistsCard from '@/components/card/SuggestedArtistsCard';
import CreatePostCard from '@/components/main/CreatePostCard';
import GradientBackground from '@/components/main/GradientBackground';
import StorySection from '@/components/main/StorySection';
import { useGetAllPost } from '@/hooks/app/home';
import useAuthStore from '@/store/auth.store';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Author {
  email: string;
  id: string;
  name: string;
}

interface Profile {
  displayName: string;
  profileImageUrl: string;
  role: string;
  username: string;
}

export interface Post {
  _id: string;
  author: Author;
  commentCount: number;
  createdAt: string;
  description: string;
  likeCount: number;
  mediaType: 'image' | 'video' | 'audio';
  mediaUrl: string;
  profile: Profile;
  viewerHasLiked: boolean;
  viewerIsFollowing: boolean;
}

const Home = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isRefetching,
    refetch,
  } = useGetAllPost();
  const { user } = useAuthStore();

  const posts = data?.pages.flatMap((page: any) => page.posts) || [];

  const renderHeader = () => (
    <View>
      {/* home header */}
      <View className='flex-row justify-between items-center mx-4 mt-3'>
        <TouchableOpacity>
          <Image
            source={require('@/assets/images/logo.png')}
            style={{ width: 60, height: 26 }}
            contentFit='contain'
          />
        </TouchableOpacity>
        <View className='flex-row gap-3 items-center'>
          <TouchableOpacity
            onPress={() => router.push('/screens/home/notification')}
          >
            <Ionicons name='notifications-outline' size={24} color='white' />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/(tabs)/profile')}>
            <Image
              source={require('@/assets/images/profile.png')}
              style={{
                width: 30,
                height: 30,
              }}
              contentFit='contain'
            />
          </TouchableOpacity>
        </View>
      </View>

      <StorySection />

      {/* post create card */}
      <CreatePostCard />
    </View>
  );

  const renderPost = ({ item, index }: { item: Post; index: number }) => {
    return (
      <View>
        <PostCard post={item} className='mt-4' currentUserId={user?.id} />
        {index === 1 && (
          <>
            <OfficePostCard className='mt-4' />
            <SuggestedArtistsCard className='mt-4' />
          </>
        )}
      </View>
    );
  };

  const renderFooter = () => {
    if (!isFetchingNextPage) return <View className='h-20' />;
    return (
      <View className='py-4'>
        <Text className='text-white text-center font-roboto-medium'>
          Loading more...
        </Text>
      </View>
    );
  };

  return (
    <GradientBackground>
      <SafeAreaView
        className='flex-1 mx-6 mt-2.5 mb-17'
        edges={['top', 'left', 'right']}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <FlatList
            data={posts}
            renderItem={renderPost}
            keyExtractor={item => item._id}
            ListHeaderComponent={renderHeader}
            ListFooterComponent={renderFooter}
            onEndReached={() => {
              if (hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
              }
            }}
            onEndReachedThreshold={0.5}
            showsVerticalScrollIndicator={false}
            refreshing={isRefetching}
            onRefresh={refetch}
            ListEmptyComponent={
              !isLoading ? (
                <View className='mt-10'>
                  <Text className='text-white text-center'>No posts found</Text>
                </View>
              ) : null
            }
          />
          {isLoading && posts.length === 0 && (
            <View className='absolute inset-0 justify-center items-center'>
              <Text className='text-white'>Loading...</Text>
            </View>
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default Home;
