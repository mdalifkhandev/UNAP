import OfficePostCard from '@/components/card/OfficePostCard';
import PostCard from '@/components/card/PostCard';
import SuggestedArtistsCard from '@/components/card/SuggestedArtistsCard';
import Input from '@/components/inpute/Inpute';
import GradientBackground from '@/components/main/GradientBackground';
import { useCreatePost, useGetAllPost } from '@/hooks/app/home';
import useAuthStore from '@/store/auth.store';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
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
  mediaType: 'image' | 'video';
  mediaUrl: string;
  profile: Profile;
  viewerHasLiked: boolean;
  viewerIsFollowing: boolean;
}

const Home = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [postText, setPostText] = useState('');
  const [result] = useGetAllPost();
  const { user } = useAuthStore();


  // @ts-ignore
  const posts: Post[] = result.data?.posts || [];
  // Use fetching or isLoading depending on the library (urql uses fetching)
  // @ts-ignore
  const loading = result.isFetching || result.isLoading;

  const { mutate: createPost, isPending: isPosting } = useCreatePost();

  const handleImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handlePost = async () => {
    if (!postText.trim() && !selectedImage) {
      alert('Please enter some text or select an image');
      return;
    }

    const formData = new FormData();
    formData.append('description', postText);

    if (selectedImage) {
      const filename = selectedImage.split('/').pop() || 'post_image.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const ext = match?.[1]?.toLowerCase() || 'jpg';
      const mimeType =
        ext === 'png'
          ? 'image/png'
          : ext === 'jpeg' || ext === 'jpg'
            ? 'image/jpeg'
            : 'image/*';

      formData.append('mediaUrl', {
        uri: selectedImage,
        name: filename,
        type: mimeType,
      } as any);
      formData.append('mediaType', 'image');
    }

    createPost(formData, {
      onSuccess: () => {
        setPostText('');
        setSelectedImage(null);
      },
      onError: (error: any) => {
        alert(error?.response?.data?.message || 'Failed to create post');
      },
    });
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
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 72 }}
          >
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
                  <Ionicons
                    name='notifications-outline'
                    size={24}
                    color='white'
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => router.push('/(tabs)/profile')}
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
              </View>
            </View>

            {/* post create card - simplified, no functionality as requested */}
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
                    <Image
                      source={{ uri: selectedImage }}
                      style={{ width: '100%', height: 200, borderRadius: 16 }}
                      contentFit='cover'
                    />
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
                  </View>
                  <TouchableOpacity
                    className={`px-4 py-2 bg-primary rounded-xl ${isPosting ? 'opacity-50' : ''}`}
                    onPress={handlePost}
                    disabled={isPosting}
                  >
                    <Text className=''>
                      {isPosting ? 'Posting...' : 'Post'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* post card - First 2 posts */}
            {!loading &&
              posts
                .slice(0, 2)
                .map(post => (
                  <PostCard
                    key={post._id}
                    post={post}
                    className='mt-4'
                    currentUserId={user?.id}
                  />
                ))}
            <OfficePostCard className='mt-4' />
            <SuggestedArtistsCard className='mt-4' />

            {/* All posts */}
            {!loading &&
              posts.map(post => (
                <PostCard
                  key={post._id}
                  post={post}
                  className='mt-4'
                  currentUserId={user?.id}
                />
              ))}

            {/* Loading state */}
            {loading && (
              <View className='mt-4 p-4 bg-[#FFFFFF0D] rounded-3xl'>
                <Text className='text-white text-center'>Loading posts...</Text>
              </View>
            )}

            {/* ..........end......... */}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default Home;
