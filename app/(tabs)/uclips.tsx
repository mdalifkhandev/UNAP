import GradientBackground from '@/components/main/GradientBackground';
import useThemeStore from '@/store/theme.store';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import React, { useMemo, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { height, width } = Dimensions.get('window');

const uclips = () => {
  const { mode } = useThemeStore();
  const isLight = mode === 'light';
  const iconColor = isLight ? 'black' : 'white';

  const initialClips = useMemo(
    () => [
      {
        id: '1',
        user: 'Maya Lin',
        caption: 'Studio session: new drop coming soon. 🎧',
        likes: 12400,
        comments: 1200,
        shares: 420,
        saved: false,
        liked: false,
        avatar: require('@/assets/images/profile.png'),
        poster: require('@/assets/images/post.png'),
      },
      {
        id: '2',
        user: 'UNAP Official',
        caption: 'Weekly spotlight: share your best 30s clip.',
        likes: 9800,
        comments: 980,
        shares: 300,
        saved: false,
        liked: false,
        avatar: require('@/assets/images/profile.png'),
        poster: require('@/assets/images/post.png'),
      },
      {
        id: '3',
        user: 'Luna Voice',
        caption: 'Late night vibes. 🌙',
        likes: 7100,
        comments: 640,
        shares: 210,
        saved: false,
        liked: false,
        avatar: require('@/assets/images/profile.png'),
        poster: require('@/assets/images/post.png'),
      },
    ],
    []
  );
  const [clips, setClips] = useState(initialClips);
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);

  const formatCount = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return `${value}`;
  };

  const handleToggleLike = (id: string) => {
    setClips(prev =>
      prev.map(item => {
        if (item.id !== id) return item;
        const liked = !item.liked;
        return {
          ...item,
          liked,
          likes: liked ? item.likes + 1 : Math.max(0, item.likes - 1),
        };
      })
    );
  };

  const handleToggleSave = (id: string) => {
    setClips(prev =>
      prev.map(item =>
        item.id === id ? { ...item, saved: !item.saved } : item
      )
    );
  };

  const handleShare = (id: string) => {
    setClips(prev =>
      prev.map(item =>
        item.id === id ? { ...item, shares: item.shares + 1 } : item
      )
    );
  };

  const openComments = (id: string) => {
    setActiveCommentId(id);
  };

  const closeComments = () => {
    setActiveCommentId(null);
  };

  const renderItem = ({ item }: { item: (typeof clips)[number] }) => {
    return (
      <View style={{ height, width }} className='relative overflow-hidden'>
        <Image
          source={item.poster}
          style={{ width: '100%', height: '100%', position: 'absolute' }}
          contentFit='cover'
        />

        <View className='absolute inset-0 bg-black/20 z-10' />

        <SafeAreaView
          edges={['top', 'left', 'right', 'bottom']}
          className='flex-1 justify-between z-20 mt-5 mb-16'
        >
          <View className='px-6 pt-3 flex-row items-center justify-between'>
            <Text className='text-black dark:text-white font-roboto-bold text-2xl'>
              UClips
            </Text>
          </View>

          <View className='flex-row justify-between items-end px-6 pb-12'>
            <View className='w-3/4'>
              <View className='flex-row items-center gap-3 mb-3'>
                <Image
                  source={item.avatar}
                  style={{ width: 44, height: 44, borderRadius: 22 }}
                  contentFit='cover'
                />
                <View>
                  <Text className='text-black dark:text-white font-roboto-semibold text-base'>
                    {item.user}
                  </Text>
                  <Text className='text-black/70 dark:text-white/70 text-xs'>
                    @unap
                  </Text>
                </View>
              </View>

              <Text className='text-black dark:text-white text-sm'>
                {item.caption}
              </Text>
            </View>

            <View className='items-center gap-5'>
              <TouchableOpacity
                className='items-center'
                onPress={() => handleToggleLike(item.id)}
              >
                <View className='h-12 w-12 rounded-full bg-black/40 items-center justify-center'>
                  <Ionicons
                    name={item.liked ? 'heart' : 'heart-outline'}
                    size={26}
                    color={item.liked ? '#E11D48' : 'white'}
                  />
                </View>
                <Text className='text-black dark:text-white text-xs mt-1'>
                  {formatCount(item.likes)}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className='items-center'
                onPress={() => openComments(item.id)}
              >
                <View className='h-12 w-12 rounded-full bg-black/40 items-center justify-center'>
                  <Ionicons
                    name='chatbubble-ellipses-outline'
                    size={24}
                    color='white'
                  />
                </View>
                <Text className='text-black dark:text-white text-xs mt-1'>
                  {formatCount(item.comments)}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className='items-center'
                onPress={() => handleShare(item.id)}
              >
                <View className='h-12 w-12 rounded-full bg-black/40 items-center justify-center'>
                  <Ionicons
                    name='share-social-outline'
                    size={24}
                    color='white'
                  />
                </View>
                <Text className='text-black dark:text-white text-xs mt-1'>
                  {formatCount(item.shares)}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className='items-center'
                onPress={() => handleToggleSave(item.id)}
              >
                <View className='h-12 w-12 rounded-full bg-black/40 items-center justify-center'>
                  <Ionicons
                    name={item.saved ? 'bookmark' : 'bookmark-outline'}
                    size={24}
                    color={item.saved ? '#2563EB' : 'white'}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  };

  return (
    <GradientBackground>
      <View className='flex-1'>
        <FlatList
          data={clips}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          snapToAlignment='start'
          decelerationRate='fast'
        />
      </View>

      <Modal
        visible={!!activeCommentId}
        transparent
        animationType='slide'
        onRequestClose={closeComments}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={closeComments}
          className='flex-1 justify-end bg-black/50'
        >
          <TouchableOpacity
            activeOpacity={1}
            className='bg-[#F0F2F5] dark:bg-[#FFFFFF0D] px-6 pt-4 pb-10 rounded-t-3xl'
          >
            <View className='w-12 h-1.5 bg-black/20 dark:bg-white/20 rounded-full self-center mb-4' />
            <Text className='text-black dark:text-white font-roboto-semibold text-lg'>
              Comments
            </Text>
            <View className='mt-4'>
              <Text className='text-black/70 dark:text-white/70'>
                No comments yet. Be the first to comment!
              </Text>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </GradientBackground>
  );
};

export default uclips;
