import PostCard from '@/components/card/PostCard';
import GradientBackground from '@/components/main/GradientBackground';
import { useGetMyPosts } from '@/hooks/app/post';
import { useGetTrendingPost } from '@/hooks/app/trending';
import {
  useGetActiveUblasts,
  useGetUblastEligibility,
  useShareUblast,
} from '@/hooks/app/ublast';
import { useTranslateTexts } from '@/hooks/app/translate';
import useAuthStore from '@/store/auth.store';
import useLanguageStore from '@/store/language.store';
import useThemeStore from '@/store/theme.store';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import React, { useEffect, useMemo, useState } from 'react';
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
import Toast from 'react-native-toast-message';

type TabType = 'manual' | 'active' | 'organic';

const TrendingScreen = () => {
  const { mode } = useThemeStore();
  const isLight = mode === 'light';
  const { user } = useAuthStore();
  const { language } = useLanguageStore();
  const [selectedTab, setSelectedTab] = useState<TabType>('active');
  const { data: t } = useTranslateTexts({
    texts: [
      'Trending',
      'Checking...',
      'Eligible',
      'Not Eligible',
      'Checking your eligibility status',
      'You can participate in trending posts',
      'Complete your profile to be eligible',
      'Blocked until',
      'Active',
      'Manual',
      'Organic',
      'No posts found',
      'Check back later for new content',
      'Share by',
    ],
    targetLang: language,
    enabled: !!language && language !== 'EN',
  });
  const tx = (i: number, fallback: string) =>
    t?.translations?.[i] || fallback;

  const { data, isLoading, isRefetching, refetch } = useGetTrendingPost(
    selectedTab,
    { enabled: !!user }
  );

  const {
    data: activeData,
    isLoading: isActiveLoading,
    refetch: refetchActive,
  } = useGetActiveUblasts({ enabled: !!user && selectedTab === 'active' });

  const { data: eligibilityData, isLoading: isEligibilityLoading } =
    useGetUblastEligibility({ enabled: !!user });

  const { data: myPostsData } = useGetMyPosts({
    enabled: !!user && selectedTab === 'active',
  });

  const [isEligible, setIsEligible] = useState(true);

  useEffect(() => {
    if (typeof (eligibilityData as any)?.eligible === 'boolean') {
      setIsEligible((eligibilityData as any).eligible);
    }
  }, [eligibilityData]);

  const trendingData = data?.[selectedTab] || [];
  const activeUblasts = activeData?.ublasts || data?.active || [];
  const myPosts = (myPostsData as any)?.posts || [];

  const sharedByUblastId = useMemo(() => {
    const map = new Map<string, any>();
    myPosts.forEach((post: any) => {
      if (post?.ublastId) {
        map.set(String(post.ublastId), post);
      }
    });
    return map;
  }, [myPosts]);

  const filteredPosts = Array.isArray(trendingData)
    ? trendingData
        .filter((item: any) => item)
        .map((item: any) => {
          const post = item.post || item;

          return {
            ...post,
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
      <Text className='font-roboto-bold text-primary dark:text-white text-2xl text-center'>
        {tx(0, 'Trending')}
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
              {isEligibilityLoading ? (
                <ActivityIndicator
                  size='small'
                  color={isLight ? 'black' : 'white'}
                />
              ) : (
                <Ionicons
                  name={isEligible ? 'checkmark-circle' : 'close-circle'}
                  size={24}
                  color={isEligible ? '#22c55e' : '#ef4444'}
                />
              )}
            </View>
            <View className='flex-1'>
              <Text className='font-roboto-bold text-primary dark:text-white text-base'>
                {isEligibilityLoading
                  ? tx(1, 'Checking...')
                  : isEligible
                    ? tx(2, 'Eligible')
                    : tx(3, 'Not Eligible')}
              </Text>
              <Text className='font-roboto-regular text-secondary dark:text-white/80 text-sm'>
                {isEligibilityLoading
                  ? tx(4, 'Checking your eligibility status')
                  : isEligible
                    ? tx(5, 'You can participate in trending posts')
                    : (eligibilityData as any)?.blockedUntil
                      ? `${tx(7, 'Blocked until')} ${new Date(
                          (eligibilityData as any).blockedUntil
                        ).toLocaleString()}`
                      : tx(6, 'Complete your profile to be eligible')}
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
              selectedTab === tab
                ? 'bg-[#F0F2F5] dark:bg-[#FFFFFF0D]'
                : 'bg-[#F0F2F5] dark:bg-[#FFFFFF0D]'
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
              color={isLight ? 'black' : 'white'}
            />
            <Text className='text-primary dark:text-white font-roboto-semibold text-sm'>
              {tab === 'active'
                ? tx(8, 'Active')
                : tab === 'manual'
                  ? tx(9, 'Manual')
                  : tx(10, 'Organic')}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const UblastCard = ({ item }: { item: any }) => {
    const { mutate: shareUblast, isPending } = useShareUblast();
    const hasShared = Boolean(item?.viewerHasShared);
    const dueAt = item?.dueAt ? new Date(item.dueAt) : null;
    const isLightTheme = isLight;
    const handleDisabledAction = () => {
      Toast.show({
        type: 'info',
        text1: 'Share Required',
        text2: 'Share to Feed first to enable likes and comments.',
      });
    };

    return (
      <View className='bg-[#F0F2F5] dark:bg-[#FFFFFF0D] rounded-3xl mx-5 mt-4 overflow-hidden'>
        <View className='p-4 flex-row justify-between items-center'>
          <View className='flex-row gap-3'>
            <Image
              source={require('@/assets/images/logo.png')}
              style={{ width: 40, height: 40, borderRadius: 20 }}
              contentFit='cover'
            />
            <View>
              <Text className='font-roboto-semibold text-sm text-primary dark:text-white'>
                {item?.title || 'UBlast'}
              </Text>
              <Text className='font-roboto-regular text-sm text-secondary dark:text-white/80'>
                Official UBlast
              </Text>
            </View>
          </View>
        </View>

        {item?.mediaType === 'image' && item?.mediaUrl ? (
          <Image
            source={{ uri: item.mediaUrl }}
            style={{ width: '100%', height: 220 }}
            contentFit='cover'
          />
        ) : (
          <View className='h-[220px] items-center justify-center bg-black/10 dark:bg-white/5'>
            <Ionicons
              name={item?.mediaType === 'audio' ? 'musical-notes' : 'play-circle'}
              size={48}
              color={isLightTheme ? 'black' : 'white'}
            />
          </View>
        )}

        <View className='p-3 flex-row justify-between items-center'>
          <View className='flex-row gap-4'>
            <TouchableOpacity onPress={handleDisabledAction}>
              <Ionicons
                name='heart-outline'
                size={26}
                color={isLightTheme ? 'black' : 'white'}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDisabledAction}>
              <Ionicons
                name='chatbubble-outline'
                size={24}
                color={isLightTheme ? 'black' : 'white'}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (!item?._id) return;
                shareUblast({ ublastId: item._id, shareType: 'feed' });
              }}
              disabled={hasShared || isPending}
            >
              <Ionicons
                name='share-social-outline'
                size={24}
                color={isLightTheme ? 'black' : 'white'}
                style={{ opacity: hasShared || isPending ? 0.5 : 1 }}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View className='px-3 pb-3'>
          {!!item?.content && (
            <Text className='font-roboto-regular text-primary dark:text-white'>
              {item.content}
            </Text>
          )}
          {dueAt && (
            <Text className='font-roboto-semibold text-sm text-secondary dark:text-white/80 mt-2.5'>
              {tx(13, 'Share by')} {dueAt.toLocaleString()}
            </Text>
          )}
        </View>
      </View>
    );
  };

  if (isLoading && !isRefetching) {
    return (
      <GradientBackground>
        <SafeAreaView
          className='flex-1 mt-2.5'
          edges={['top', 'left', 'right']}
        >
          {renderHeader()}
          <View className='flex-1 justify-center items-center'>
            <ActivityIndicator
              size='large'
              color={isLight ? 'black' : 'white'}
            />
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
            data={selectedTab === 'active' ? activeUblasts : filteredPosts}
            renderItem={({ item }) => {
              if (selectedTab === 'active') {
                const sharedPost = sharedByUblastId.get(String(item?._id));
                if (sharedPost) {
                  return (
                    <PostCard
                      post={sharedPost}
                      currentUserId={user?.id}
                      className='mt-4 mx-5'
                    />
                  );
                }
                return <UblastCard item={item} />;
              }
              return (
                <PostCard
                  post={item}
                  currentUserId={user?.id}
                  className='mt-4 mx-5'
                />
              );
            }}
            keyExtractor={(item: any) => item._id}
            ListHeaderComponent={renderHeader()}
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
            refreshing={selectedTab === 'active' ? isActiveLoading : isRefetching}
            onRefresh={() => {
              if (selectedTab === 'active') {
                refetchActive();
              } else {
                refetch();
              }
            }}
            ListEmptyComponent={
              <View className='mt-10 items-center mx-6'>
                <Ionicons name='file-tray-outline' size={48} color='#666' />
                <Text className='text-secondary dark:text-white/80 text-center mt-4 font-roboto-regular'>
                  {tx(11, 'No posts found')}
                </Text>
                <Text className='text-secondary dark:text-white/80/60 text-center mt-2 font-roboto-regular text-sm'>
                  {tx(12, 'Check back later for new content')}
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
