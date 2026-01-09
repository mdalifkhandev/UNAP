import OfficePostCard from '@/components/card/OfficePostCard';
import PostCard from '@/components/card/PostCard';
import SuggestedArtistsCard from '@/components/card/SuggestedArtistsCard';
import Input from '@/components/inpute/Inpute';
import GradientBackground from '@/components/main/GradientBackground';
import { useGetAllPost } from '@/hooks/app/home';
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

// Import PostData type from PostCard
// Import PostData type if needed, or define locally matching the API
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

  // @ts-ignore
  // @ts-ignore
  const posts: Post[] = result.data?.posts || [];
  // Use fetching or isLoading depending on the library (urql uses fetching)
  // @ts-ignore
  const loading = result.fetching || result.isLoading;

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
                    className='px-4 py-2 bg-primary rounded-xl'
                    onPress={() => alert('Posting functionality disabled temporarily')}
                  >
                    <Text className=''>Post</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* post card - First 2 posts */}
            {!loading &&
              posts
                .slice(0, 2)
                .map(post => (
                  <PostCard key={post._id} post={post} className='mt-4' />
                ))}
            <OfficePostCard className='mt-4' />
            <SuggestedArtistsCard className='mt-4' />

            {/* All posts */}
            {!loading &&
              posts.map(post => (
                <PostCard key={post._id} post={post} className='mt-4' />
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
