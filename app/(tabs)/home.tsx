import OfficePostCard from '@/components/card/OfficePostCard';
import PostCard from '@/components/card/PostCard';
import SuggestedArtistsCard from '@/components/card/SuggestedArtistsCard';
import Input from '@/components/inpute/Inpute';
import GradientBackground from '@/components/main/GradientBackground';
import { useGetAllPost } from '@/hooks/app/home';
import { useCreatePost } from '@/hooks/app/post';
import useAuthStore from '@/store/auth.store';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import React, { useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [postText, setPostText] = useState('');
  const [selectedMediaType, setSelectedMediaType] = useState<
    'image' | 'video' | 'audio'
  >('image');
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

  const { mutate: createPost, isPending: isPosting } = useCreatePost();

  const handleImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      const asset = pickerResult.assets[0];
      setSelectedImage(asset.uri);
      // @ts-ignore
      setSelectedMediaType(asset.type === 'video' ? 'video' : 'image');
    }
  };

  const handlePost = async () => {
    if (!postText.trim() && !selectedImage) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please enter a description or select media.',
      });
      return;
    }

    const formData = new FormData();
    formData.append('description', postText);
    formData.append('shareToFacebook', 'true');
    formData.append('shareToInstagram', 'true');

    if (selectedImage) {
      const filename = selectedImage.split('/').pop() || 'post_media.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const ext = match?.[1]?.toLowerCase() || 'jpg';
      const isVideo = selectedMediaType === 'video';

      const mimeType = isVideo
        ? `video/${ext === 'mov' ? 'quicktime' : 'mp4'}`
        : ext === 'png'
          ? 'image/png'
          : 'image/jpeg';

      formData.append('media', {
        uri: selectedImage,
        name: filename,
        type: mimeType,
      } as any);
      formData.append('mediaType', selectedMediaType);
    }

    createPost(formData, {
      onSuccess: () => {
        setPostText('');
        setSelectedImage(null);
        setSelectedMediaType('image');
      },
      onError: (error: any) => {
        // Handled by hook
      },
    });
  };

  const previewPlayer = useVideoPlayer(selectedImage || '', player => {
    if (selectedMediaType === 'video') {
      player.loop = true;
      player.play();
    }
  });

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

      {/* post create card */}
      <View className='p-6 bg-[#FFFFFF0D] rounded-3xl mt-6 flex-row gap-5'>
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/profile')}
          className='mt-2'
        >
          <Image
            source={require('@/assets/images/profile.png')}
            style={{
              width: 30,
              height: 30,
            }}
            contentFit='contain'
          />
        </TouchableOpacity>
        <View className=' flex-1'>
          <Input
            placeholder="What's on your mind?"
            inputeStyle='pb-10'
            value={postText}
            onChangeText={setPostText}
            multiline
          />

          {selectedImage && (
            <View className='mt-4 relative'>
              {selectedMediaType === 'image' ? (
                <Image
                  source={{ uri: selectedImage }}
                  style={{ width: '100%', height: 200, borderRadius: 16 }}
                  contentFit='cover'
                />
              ) : (
                <VideoView
                  style={{ width: '100%', height: 200, borderRadius: 16 }}
                  player={previewPlayer}
                  nativeControls={false}
                />
              )}
              <TouchableOpacity
                onPress={() => setSelectedImage(null)}
                className='absolute top-2 right-2 bg-black/50 p-1 rounded-full'
              >
                <Ionicons name='close' size={20} color='white' />
              </TouchableOpacity>
            </View>
          )}

          <View className='flex-row justify-between mt-5'>
            <View className='flex-row gap-6'>
              <TouchableOpacity
                onPress={handleImagePicker}
                className='flex-row items-center gap-2'
              >
                <Feather name='image' size={18} color='white' />
                <Text className='text-white'>Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push('/(tabs)/create')}
                className='flex-row items-center gap-2'
              >
                <Feather name='maximize' size={18} color='white' />
                <Text className='text-white'>Full</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              className={`px-4 py-2 bg-primary rounded-xl ${isPosting ? 'opacity-50' : ''}`}
              onPress={handlePost}
              disabled={isPosting}
            >
              <Text className=''>{isPosting ? 'Posting...' : 'Post'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
