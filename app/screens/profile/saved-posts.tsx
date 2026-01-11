import PostCard from '@/components/card/PostCard';
import GradientBackground from '@/components/main/GradientBackground';
import { useGetSavedPosts } from '@/hooks/app/home';
import useAuthStore from '@/store/auth.store';
import Ionicons from '@expo/vector-icons/Ionicons';
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

const SavedPosts = () => {
  const { data, isLoading, refetch, isRefetching } = useGetSavedPosts();
  const { user } = useAuthStore();

  // @ts-ignore
  const posts = data?.bookmarks?.map((b: any) => b.post) || [];

  const renderHeader = () => (
    <View className='flex-row items-center mx-6 mt-3 mb-6'>
      <TouchableOpacity onPress={() => router.back()} className='p-2 mr-2 bg-[#FFFFFF0D] rounded-full'>
        <Ionicons name='chevron-back' size={24} color='white' />
      </TouchableOpacity>
      <Text className='font-roboto-bold text-primary text-2xl flex-1 text-center pr-10'>
        Saved Posts
      </Text>
    </View>
  );

  return (
    <GradientBackground>
      <SafeAreaView className='flex-1' edges={['top', 'left', 'right']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <FlatList
            data={posts}
            renderItem={({ item }) => (
              <PostCard post={item} className='mt-0 mb-6 mx-4' currentUserId={user?.id} />
            )}
            keyExtractor={item => item?._id || Math.random().toString()}
            ListHeaderComponent={renderHeader}
            showsVerticalScrollIndicator={false}
            refreshing={isRefetching}
            onRefresh={refetch}
            ListEmptyComponent={
              !isLoading ? (
                <View className='mt-20 items-center'>
                  <Ionicons name='bookmark-outline' size={64} color='#666' />
                  <Text className='text-secondary text-lg font-roboto-medium mt-4'>
                    No saved posts yet
                  </Text>
                  <TouchableOpacity
                    onPress={() => router.push('/(tabs)/home')}
                    className='mt-6 px-8 py-3 bg-white rounded-full'
                  >
                    <Text className='text-black font-roboto-bold'>Explore Posts</Text>
                  </TouchableOpacity>
                </View>
              ) : null
            }
          />
          {isLoading && (
            <View className='absolute inset-0 justify-center items-center'>
              <Text className='text-white font-roboto-medium'>Loading your collection...</Text>
            </View>
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default SavedPosts;
