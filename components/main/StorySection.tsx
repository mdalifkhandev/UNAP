import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

export interface Story {
  id: string;
  user: string;
  avatar: string;
  storyImage: string;
  isMe?: boolean;
}

export const stories: Story[] = [
  {
    id: '0',
    user: 'Add to story',
    avatar: 'https://randomuser.me/api/portraits/men/44.jpg',
    storyImage: 'https://randomuser.me/api/portraits/men/44.jpg',
    isMe: true,
  },
  {
    id: '1',
    user: 'Maya Lin',
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    storyImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: '2',
    user: 'Alex Rivers',
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    storyImage: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: '3',
    user: 'Sarah Chen',
    avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
    storyImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: '4',
    user: 'James Bond',
    avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
    storyImage: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1000&auto=format&fit=crop',
  },
];

const StoryCard = ({ story, index }: { story: Story; index: number }) => {
  if (story.isMe) {
    return (
      <TouchableOpacity className="w-28 h-40 mr-3 rounded-2xl overflow-hidden bg-[#FFFFFF1A] border border-white/10">
        <Image source={story.storyImage} style={{ width: '100%', height: '70%' }} contentFit="cover" />
        <View className="flex-1 items-center justify-center -mt-5">
          <View className="bg-white p-1 rounded-full border-2 border-black">
            <Ionicons name="add" size={20} color="black" />
          </View>
          <Text className="text-white text-[10px] font-roboto-medium mt-1">Create Story</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={() => router.push({
        pathname: '/screens/home/story-view',
        params: {
          initialIndex: index.toString()
        }
      })}
      className="w-28 h-40 mr-3 rounded-2xl overflow-hidden bg-[#FFFFFF1A] border border-white/10"
    >
      <Image source={story.storyImage} style={{ width: '100%', height: '100%', position: 'absolute' }} contentFit="cover" />
      <View className="absolute inset-0 bg-black/20" />

      {/* Profile Avatar */}
      <View className="p-2">
        <View className="w-8 h-8 rounded-full border-2 border-primary overflow-hidden">
          <Image source={story.avatar} style={{ width: '100%', height: '100%' }} contentFit="cover" />
        </View>
      </View>

      <Text className="absolute bottom-2 left-2 right-2 text-white text-[10px] font-roboto-medium" numberOfLines={1}>
        {story.user}
      </Text>
    </TouchableOpacity>
  );
};

const StorySection = () => {
  return (
    <View className="mt-6 mb-2">
      <FlatList
        data={stories}
        renderItem={({ item, index }) => <StoryCard story={item} index={index} />}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 0 }}
      />
    </View>
  );
};

export default StorySection;
