import { useGetUCutsFeed } from '@/hooks/app/ucuts';
import useAuthStore from '@/store/auth.store';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useMemo } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

export interface Story {
  id: string;
  user: string;
  avatar: string;
  storyImage: string;
  isMe?: boolean;
}

const StoryCard = ({ story }: { story: Story }) => {
  if (story.isMe) {
    return (
      <TouchableOpacity
        onPress={() => router.push('/screens/home/create-ucuts')}
        className='w-28 h-40 mr-3 rounded-2xl overflow-hidden bg-[#F0F2F5] dark:bg-[#FFFFFF0D] border border-black/20 dark:border-[#FFFFFF0D]'
      >
        <Image
          source={story.storyImage}
          style={{ width: '100%', height: '70%' }}
          contentFit='cover'
        />
        <View className='flex-1 items-center justify-center -mt-5'>
          <View className='bg-white p-1 rounded-full border-2 border-black'>
            <Ionicons name='add' size={20} color='black' />
          </View>
          <Text className='text-black dark:text-white text-[9px] font-roboto-medium mt-1'>
            Create UCuts
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: '/screens/home/ucuts-view',
          params: {
            ownerId: story.id,
          },
        })
      }
      className='w-28 h-40 mr-3 rounded-2xl overflow-hidden bg-[#F0F2F5] dark:bg-[#FFFFFF0D] border border-black/20 dark:border-[#FFFFFF0D]'
    >
      <Image
        source={story.storyImage}
        style={{ width: '100%', height: '100%', position: 'absolute' }}
        contentFit='cover'
      />
      <View className='absolute inset-0 bg-black/20 dark:bg-black/20' />

      {/* Profile Avatar */}
      <View className='p-2'>
        <View className='w-8 h-8 rounded-full border-2 border-primary overflow-hidden'>
          <Image
            source={story.avatar}
            style={{ width: '100%', height: '100%' }}
            contentFit='cover'
          />
        </View>
      </View>

      <Text
        className='absolute bottom-2 left-2 right-2 text-black dark:text-white text-[10px] font-roboto-medium'
        numberOfLines={1}
      >
        {story.user}
      </Text>
    </TouchableOpacity>
  );
};

const StorySection = () => {
  const { user } = useAuthStore();
  const { data } = useGetUCutsFeed();
  const ucuts = data?.ucuts ?? [];

  const stories: Story[] = useMemo(() => {
    const groups = new Map<
      string,
      {
        ownerId: string;
        ownerName: string;
        ownerAvatar: string;
        latestAt: number;
        items: any[];
      }
    >();

    ucuts.forEach((ucut: any) => {
      const owner = ucut?.owner || {};
      const ownerId = owner?.id || ucut?.userId;
      if (!ownerId) return;
      const createdAt = new Date(ucut?.createdAt || 0).getTime();
      const existing = groups.get(ownerId);
      const ownerName = owner?.name || 'User';
      const ownerAvatar =
        owner?.profileImageUrl || 'https://via.placeholder.com/150';

      if (!existing) {
        groups.set(ownerId, {
          ownerId,
          ownerName,
          ownerAvatar,
          latestAt: createdAt,
          items: [ucut],
        });
      } else {
        existing.items.push(ucut);
        if (createdAt > existing.latestAt) {
          existing.latestAt = createdAt;
        }
      }
    });

    const groupedStories = Array.from(groups.values())
      .sort((a, b) => {
        if (a.ownerId === user?.id) return -1;
        if (b.ownerId === user?.id) return 1;
        return b.latestAt - a.latestAt;
      })
      .map(group => {
        const latest = [...group.items].sort((a: any, b: any) => {
          const aTime = new Date(a?.createdAt || 0).getTime();
          const bTime = new Date(b?.createdAt || 0).getTime();
          return bTime - aTime;
        })[0];
        const firstSegment = [...(latest?.segments || [])].sort(
          (a: any, b: any) => (a.order || 0) - (b.order || 0)
        )[0];

        return {
          id: group.ownerId,
          user: group.ownerName,
          avatar: group.ownerAvatar,
          storyImage: firstSegment?.url || 'https://via.placeholder.com/150',
        };
      });

    return [
      {
        id: 'add-ucuts',
        user: 'Add to UCuts',
        avatar:
          (user as any)?.profileImageUrl ||
          'https://via.placeholder.com/150',
        storyImage:
          (user as any)?.profileImageUrl ||
          'https://via.placeholder.com/150',
        isMe: true,
      },
      ...groupedStories,
    ];
  }, [ucuts, user]);

  return (
    <View className='mt-6 mb-2'>
      <FlatList
        data={stories}
        renderItem={({ item }) => <StoryCard story={item} />}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 0 }}
      />
    </View>
  );
};

export default StorySection;
