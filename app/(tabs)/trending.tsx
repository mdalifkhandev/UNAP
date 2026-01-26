import PostCard from '@/components/card/PostCard';
import GradientBackground from '@/components/main/GradientBackground';
import { useGetTrendingPost } from '@/hooks/app/trending';
import useAuthStore from '@/store/auth.store';
import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type TabType = 'manual' | 'active' | 'organic';

const TrendingScreen = () => {
  const { user } = useAuthStore();
  const [selectedTab, setSelectedTab] = useState<TabType>('manual');

  // For demo purposes, assuming user is eligible
  // You can replace this with actual API call to check eligibility
  const [isEligible, setIsEligible] = useState(true);

  // Fetch trending posts based on selected tab
  const { data, isLoading, isRefetching, refetch } = useGetTrendingPost(
    selectedTab,
    { enabled: !!user }
  );

  console.log(JSON.stringify(data, null, 2));

  // Extract posts from the API response
  // The API returns data in format: { manual: [...], active: [...], organic: [...] }
  // Each array contains objects with { placementId, position, post: {...} }
  const trendingData = data?.[selectedTab] || [];

  // Map the posts and ensure they have the required fields for PostCard
  // Note: The backend should ideally return author and profile data
  const filteredPosts = Array.isArray(trendingData)
    ? trendingData
        .filter((item: any) => item) // Filter out null/undefined items
        .map((item: any) => {
          // Check if this is a nested structure (manual/active) or direct (organic)
          const post = item.post || item; // Use item.post if exists, otherwise use item directly
          // If the post doesn't have author/profile, we need to handle it
          // For now, we'll pass the post as-is and let PostCard handle missing data
          return {
            ...post,
            // Ensure required fields exist (PostCard will use defaults if missing)
            author: post.author || {
              id: post.userId || '',
              email: '',
              name: '',
            },
            profile: post.profile || {
              displayName: '',
              profileImageUrl: '',
              role: '',
              username: '',
            },
            commentCount: post.commentCount || 0,
            likeCount: post.likeCount || 0,
            viewerHasLiked: post.viewerHasLiked || false,
            viewerIsFollowing: post.viewerIsFollowing || false,
          };
        })
    : [];

  const renderHeader = () => (
    <View>
      {/* Header */}

      <Text className='font-roboto-bold text-primary text-2xl text-center'>
        Trending
      </Text>

      {/* Eligibility Status Banner */}
      <View className='mx-5 mt-4'>
        <View
          className={`rounded-2xl p-4 flex-row items-center justify-between ${
            isEligible
              ? 'bg-green-500/20 border border-green-500/50'
              : 'bg-red-500/20 border border-red-500/50'
          }`}
        >
          <View className='flex-row items-center gap-3'>
            <View
              className={`w-10 h-10 rounded-full items-center justify-center ${
                isEligible ? 'bg-green-500/30' : 'bg-red-500/30'
              }`}
            >
              <Ionicons
                name={isEligible ? 'checkmark-circle' : 'close-circle'}
                size={24}
                color={isEligible ? '#22c55e' : '#ef4444'}
              />
            </View>
            <View className='flex-1'>
              <Text className='font-roboto-bold text-primary text-base'>
                {isEligible ? 'Eligible' : 'Not Eligible'}
              </Text>
              <Text className='font-roboto-regular text-secondary text-sm'>
                {isEligible
                  ? 'You can participate in trending posts'
                  : 'Complete your profile to be eligible'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View className='flex-row justify-between items-center gap-3 mt-6 mx-5'>
        {(['manual', 'active', 'organic'] as TabType[]).map(tab => (
          <TouchableOpacity
            key={tab}
            onPress={() => setSelectedTab(tab)}
            className={`flex-1 py-3 rounded-xl flex-row gap-2 items-center justify-center ${
              selectedTab === tab ? 'bg-white/20' : 'bg-white/5'
            }`}
          >
            <Ionicons
              name={
                tab === 'active'
                  ? 'flame'
                  : tab === 'manual'
                    ? 'trophy'
                    : 'leaf'
              }
              size={20}
              color='white'
            />
            <Text className='text-primary font-roboto-semibold text-sm'>
              {tab === 'active'
                ? 'Active'
                : tab === 'manual'
                  ? 'Manual'
                  : 'Organic'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  if (isLoading && !isRefetching) {
    return (
      <GradientBackground>
        <SafeAreaView
          className='flex-1 mt-2.5'
          edges={['top', 'left', 'right']}
        >
          {renderHeader()}
          <View className='flex-1 justify-center items-center'>
            <ActivityIndicator size='large' color='white' />
          </View>
        </SafeAreaView>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <SafeAreaView className='flex-1 mt-2.5' edges={['top', 'left', 'right']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <FlatList
            data={filteredPosts}
            renderItem={({ item }) => (
              <PostCard
                post={item}
                currentUserId={user?.id}
                className='mt-4 mx-5'
              />
            )}
            keyExtractor={(item: any) => item._id}
            ListHeaderComponent={renderHeader()}
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
            refreshing={isRefetching}
            onRefresh={refetch}
            ListEmptyComponent={
              <View className='mt-10 items-center mx-6'>
                <Ionicons name='file-tray-outline' size={48} color='#666' />
                <Text className='text-secondary text-center mt-4 font-roboto-regular'>
                  No {selectedTab} posts found
                </Text>
                <Text className='text-secondary/60 text-center mt-2 font-roboto-regular text-sm'>
                  Check back later for new content
                </Text>
              </View>
            }
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default TrendingScreen;
