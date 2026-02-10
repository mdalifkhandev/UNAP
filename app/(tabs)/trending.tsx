import PostCard from '@/components/card/PostCard';
import GradientBackground from '@/components/main/GradientBackground';
import { useGetMyPostsInfinite } from '@/hooks/app/post';
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
import { useVideoPlayer, VideoView } from 'expo-video';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { useIsFocused } from '@react-navigation/native';

type TabType = 'manual' | 'active' | 'organic';

const TrendingScreen = () => {
  const { mode } = useThemeStore();
  const isLight = mode === 'light';
  const { user } = useAuthStore();
  const { language } = useLanguageStore();
  const isFocused = useIsFocused();
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
      'Share Required',
      'Share to Feed first to enable likes and comments.',
      'Official UBlast',
      'Tap to play audio',
      'Share UBlast',
      'Share to Feed',
      'Share to Story',
      'Share to Facebook',
      'Share to Instagram',
      'Cancel',
    ],
    targetLang: language,
    enabled: !!language && language !== 'EN',
  });
  const tx = (i: number, fallback: string) =>
    t?.translations?.[i] || fallback;

  const {
    data,
    isLoading,
    isRefetching,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetTrendingPost(selectedTab, { enabled: !!user });

  const {
    data: activeData,
    isLoading: isActiveLoading,
    refetch: refetchActive,
    fetchNextPage: fetchNextActive,
    hasNextPage: hasNextActive,
    isFetchingNextPage: isFetchingNextActive,
  } = useGetActiveUblasts({ enabled: !!user && selectedTab === 'active', limit: 12 });

  const { data: eligibilityData, isLoading: isEligibilityLoading } =
    useGetUblastEligibility({ enabled: !!user });

  const {
    data: myPostsData,
    fetchNextPage: fetchNextMyPosts,
    hasNextPage: hasNextMyPosts,
    isFetchingNextPage: isFetchingNextMyPosts,
  } = useGetMyPostsInfinite({
    enabled: !!user && selectedTab === 'active',
    limit: 20,
  });

  const [isEligible, setIsEligible] = useState(true);

  useEffect(() => {
    if (typeof (eligibilityData as any)?.eligible === 'boolean') {
      setIsEligible((eligibilityData as any).eligible);
    }
  }, [eligibilityData]);

  const trendingData = useMemo(
    () => data?.pages?.flatMap((page: any) => page?.[selectedTab] || []) || [],
    [data, selectedTab]
  );
  const activeUblastsRaw = useMemo(
    () =>
      activeData?.pages?.flatMap((page: any) => page?.ublasts || []) ||
      data?.pages?.flatMap((page: any) => page?.active || []) ||
      [],
    [activeData, data]
  );
  const activeUblasts = useMemo(() => {
    const seen = new Set<string>();
    return activeUblastsRaw.filter((item: any) => {
      const id = String(item?._id || '');
      if (!id) return false;
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  }, [activeUblastsRaw]);
  const myPosts = useMemo(
    () => myPostsData?.pages?.flatMap((page: any) => page?.posts || []) || [],
    [myPostsData]
  );

  const sharedByUblastId = useMemo(() => {
    const map = new Map<string, any>();
    myPosts.forEach((post: any) => {
      if (post?.ublastId) {
        map.set(String(post.ublastId), post);
      }
    });
    return map;
  }, [myPosts]);

  const filteredPosts = useMemo(() => {
    if (!Array.isArray(trendingData)) return [];
    const seen = new Set<string>();
    return trendingData
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
      .filter((post: any) => {
        const id = String(post?._id || '');
        if (!id) return false;
        if (seen.has(id)) return false;
        seen.add(id);
        return true;
      });
  }, [trendingData]);

  const [visibleIds, setVisibleIds] = useState<Set<string>>(new Set());
  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 60 });
  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    const ids = new Set<string>();
    viewableItems.forEach((vi: any) => {
      if (vi?.item?._id) ids.add(vi.item._id);
    });
    setVisibleIds(ids);
  });

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

  const UblastCard = ({
    item,
    isVisible,
    isFocused,
  }: {
    item: any;
    isVisible: boolean;
    isFocused: boolean;
  }) => {
    const { mutate: shareUblast, isPending } = useShareUblast();
    const [isShareBusy, setIsShareBusy] = useState(false);
    const hasShared = Boolean(item?.viewerHasShared);
    const dueAt = item?.dueAt ? new Date(item.dueAt) : null;
    const isLightTheme = isLight;
    const handleDisabledAction = () => {
      Toast.show({
        type: 'info',
        text1: tx(14, 'Share Required'),
        text2: tx(15, 'Share to Feed first to enable likes and comments.'),
      });
    };

    const [showShareTypeModal, setShowShareTypeModal] = useState(false);
    const mediaUrl = item?.mediaUrl || '';
    const mediaType = item?.mediaType;
    const player = useVideoPlayer(mediaUrl, p => {
      p.loop = true;
    });

    useEffect(() => {
      if (mediaType !== 'video' && mediaType !== 'audio') return;
      if (isVisible && isFocused) {
        if (mediaType === 'video') player.play();
      } else {
        player.pause();
      }
    }, [isVisible, isFocused, mediaType, player]);

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
                {tx(16, 'Official UBlast')}
              </Text>
            </View>
          </View>
        </View>

        {mediaType === 'image' && mediaUrl ? (
          <Image
            source={{ uri: mediaUrl }}
            style={{ width: '100%', height: 220 }}
            contentFit='cover'
          />
        ) : mediaType === 'video' && mediaUrl ? (
          <VideoView
            style={{ width: '100%', height: 220 }}
            player={player}
            nativeControls={false}
            contentFit='cover'
          />
        ) : mediaType === 'audio' ? (
          <View className='h-[220px] items-center justify-center bg-black/10 dark:bg-white/5'>
            <TouchableOpacity
              className='bg-black/20 dark:bg-white/10 p-4 rounded-full'
              onPress={() => {
                if (player.playing) player.pause();
                else player.play();
              }}
            >
              <Ionicons
                name={player.playing ? 'pause' : 'play'}
                size={28}
                color={isLightTheme ? 'black' : 'white'}
              />
            </TouchableOpacity>
            <Text className='mt-3 text-black/70 dark:text-white/70'>
              {tx(17, 'Tap to play audio')}
            </Text>
          </View>
        ) : (
          <View className='h-[220px] items-center justify-center bg-black/10 dark:bg-white/5'>
            <Ionicons
              name={mediaType === 'audio' ? 'musical-notes' : 'play-circle'}
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
                setShowShareTypeModal(true);
              }}
              disabled={hasShared || isPending || isShareBusy}
            >
              <Ionicons
                name='share-social-outline'
                size={24}
                color={isLightTheme ? 'black' : 'white'}
                style={{ opacity: hasShared || isPending || isShareBusy ? 0.5 : 1 }}
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

        <Modal
          visible={showShareTypeModal}
          transparent
          animationType='fade'
          onRequestClose={() => setShowShareTypeModal(false)}
        >
          <TouchableWithoutFeedback onPress={() => setShowShareTypeModal(false)}>
            <View className='flex-1 bg-black/50 justify-end'>
              <TouchableWithoutFeedback>
                <View className='bg-white dark:bg-[#111111] p-6 rounded-t-3xl'>
                  <Text className='text-black dark:text-white font-roboto-semibold text-lg mb-4'>
                    {tx(18, 'Share UBlast')}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      if (!item?._id) return;
                      setIsShareBusy(true);
                      shareUblast({ ublastId: item._id, shareType: 'feed' });
                      setShowShareTypeModal(false);
                      setIsShareBusy(false);
                    }}
                    className='py-3 px-4 rounded-xl bg-[#F0F2F5] dark:bg-white/10 mb-3'
                    disabled={isPending || isShareBusy}
                  >
                    <Text className='text-black dark:text-white font-roboto-medium'>
                      {isPending || isShareBusy ? 'Sharing...' : tx(19, 'Share to Feed')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      if (!item?._id) return;
                      setIsShareBusy(true);
                      shareUblast({ ublastId: item._id, shareType: 'story' });
                      setShowShareTypeModal(false);
                      setIsShareBusy(false);
                    }}
                    className='py-3 px-4 rounded-xl bg-[#F0F2F5] dark:bg-white/10 mb-3'
                    disabled={isPending || isShareBusy}
                  >
                    <Text className='text-black dark:text-white font-roboto-medium'>
                      {isPending || isShareBusy ? 'Sharing...' : tx(20, 'Share to Story')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      if (!item?._id) return;
                      setIsShareBusy(true);
                      shareUblast({ ublastId: item._id, shareType: 'feed' });
                      setShowShareTypeModal(false);
                      setIsShareBusy(false);
                      Toast.show({
                        type: 'info',
                        text1: 'Facebook',
                        text2: 'Shared to feed (Facebook integration pending).',
                      });
                    }}
                    className='py-3 px-4 rounded-xl bg-[#F0F2F5] dark:bg-white/10 mb-3'
                    disabled={isPending || isShareBusy}
                  >
                    <Text className='text-black dark:text-white font-roboto-medium'>
                      {isPending || isShareBusy ? 'Sharing...' : tx(21, 'Share to Facebook')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      if (!item?._id) return;
                      setIsShareBusy(true);
                      shareUblast({ ublastId: item._id, shareType: 'feed' });
                      setShowShareTypeModal(false);
                      setIsShareBusy(false);
                      Toast.show({
                        type: 'info',
                        text1: 'Instagram',
                        text2: 'Shared to feed (Instagram integration pending).',
                      });
                    }}
                    className='py-3 px-4 rounded-xl bg-[#F0F2F5] dark:bg-white/10 mb-3'
                    disabled={isPending || isShareBusy}
                  >
                    <Text className='text-black dark:text-white font-roboto-medium'>
                      {isPending || isShareBusy ? 'Sharing...' : tx(22, 'Share to Instagram')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setShowShareTypeModal(false)}
                    className='mt-2 py-3 px-4 rounded-xl border border-black/10 dark:border-white/10'
                  >
                    <Text className='text-center text-black dark:text-white font-roboto-medium'>
                      {tx(23, 'Cancel')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
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
                      isVisible={isFocused && visibleIds.has(sharedPost._id)}
                    />
                  );
                }
                return (
                  <UblastCard
                    item={item}
                    isVisible={visibleIds.has(item._id)}
                    isFocused={isFocused}
                  />
                );
              }
              return (
                <PostCard
                  post={item}
                  currentUserId={user?.id}
                  className='mt-4 mx-5'
                  isVisible={isFocused && visibleIds.has(item._id)}
                />
              );
            }}
            keyExtractor={(item: any, index: number) =>
              item?._id ? String(item._id) : `trending-${index}`
            }
            ListHeaderComponent={renderHeader()}
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
            viewabilityConfig={viewabilityConfig.current}
            onViewableItemsChanged={onViewableItemsChanged.current}
            refreshing={selectedTab === 'active' ? isActiveLoading : isRefetching}
            onRefresh={() => {
              if (selectedTab === 'active') {
                refetchActive();
              } else {
                refetch();
              }
            }}
            onEndReached={() => {
              if (selectedTab === 'active') {
                if (hasNextActive && !isFetchingNextActive) {
                  fetchNextActive();
                }
                if (hasNextMyPosts && !isFetchingNextMyPosts) {
                  fetchNextMyPosts();
                }
                return;
              }
              if (hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
              }
            }}
            onEndReachedThreshold={0.4}
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
            ListFooterComponent={
              (selectedTab === 'active'
                ? isFetchingNextActive || isFetchingNextMyPosts
                : isFetchingNextPage) ? (
                <View className='py-4 items-center'>
                  <ActivityIndicator size='small' color={isLight ? 'black' : 'white'} />
                </View>
              ) : (
                <View className='h-8' />
              )
            }
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default TrendingScreen;
