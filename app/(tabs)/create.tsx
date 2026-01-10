import GradientBackground from '@/components/main/GradientBackground';
import { useCreatePost } from '@/hooks/app/create';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { ResizeMode, Video } from 'expo-av';
import * as DocumentPicker from 'expo-document-picker';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CreatePost = () => {
  const [isFacebook, setIsFacebook] = useState(false);
  const [isInstagram, setIsInstagram] = useState(false);
  const [description, setDescription] = useState('');
  const [isLoadingState, setIsLoadingState] = useState(false);

  const [photo, setPhoto] = useState<string | null>(null);
  const [video, setVideo] = useState<string | null>(null);
  const [audio, setAudio] = useState<string | null>(null);

  const videoRef = useRef<Video>(null);
  const router = useRouter();

  const { mutate: createPost, isPending } = useCreatePost();
  const isLoading = isLoadingState || isPending;

  // Photo pick
  const pickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
      setVideo(null);
      setAudio(null);
    }
  };

  // Video pick
  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 1,
    });
    if (!result.canceled) {
      setVideo(result.assets[0].uri);
      setPhoto(null);
      setAudio(null);
    }
  };

  // Audio pick
  const pickAudio = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: true,
      });
      if (result.assets && result.assets.length > 0) {
        const audioUri = result.assets[0].uri;
        setAudio(audioUri);
        setPhoto(null);
        setVideo(null);
      }
    } catch (error) {
      console.error('Error picking audio:', error);
    }
  };

  /** ======================= NEW: Prepare all post data ======================= */
  const handleCreatePost = async () => {
    if (!photo && !video && !audio) {
      alert('Please select a media file (photo, video, or audio)');
      return;
    }

    if (!description.trim()) {
      alert('Please add a description');
      return;
    }

    const formData = new FormData();

    // Add media file
    if (photo) {
      const filename = photo.split('/').pop() || 'photo.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const ext = match?.[1]?.toLowerCase() || 'jpg';
      formData.append('media', {
        uri: photo,
        name: filename,
        type: `image/${ext === 'png' ? 'png' : 'jpeg'}`,
      } as any);
      formData.append('mediaType', 'image');
    } else if (video) {
      const filename = video.split('/').pop() || 'video.mp4';
      const match = /\.(\w+)$/.exec(filename);
      const ext = match?.[1]?.toLowerCase() || 'mp4';
      formData.append('media', {
        uri: video,
        name: filename,
        type: `video/${ext === 'mov' ? 'quicktime' : 'mp4'}`,
      } as any);
      formData.append('mediaType', 'video');
    } else if (audio) {
      const filename = audio.split('/').pop() || 'audio.mp3';
      const match = /\.(\w+)$/.exec(filename);
      const ext = match?.[1]?.toLowerCase() || 'mp3';
      formData.append('media', {
        uri: audio,
        name: filename,
        type: `audio/${ext === 'wav' ? 'wav' : 'mpeg'}`,
      } as any);
      formData.append('mediaType', 'audio');
    }

    // Add other fields
    formData.append('description', description);
    formData.append('shareToFacebook', isFacebook.toString());
    formData.append('shareToInstagram', isInstagram.toString());

    createPost(formData, {
      onSuccess: () => {
        // Reset form
        setPhoto(null);
        setVideo(null);
        setAudio(null);
        setDescription('');
        setIsFacebook(false);
        setIsInstagram(false);

        alert('Post created successfully!');
        router.push('/(tabs)/home');
      },
      onError: (error: any) => {
        alert(error?.response?.data?.message || 'Failed to create post');
      },
    });
  };

  return (
    <GradientBackground>
      <SafeAreaView className='flex-1' edges={['top', 'left', 'right']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          {/* header */}
          <View className='mt-3 flex-row items-center mx-6 justify-between'>
            <TouchableOpacity onPress={() => router.back()}>
              <AntDesign name='close' size={22} color='white' />
            </TouchableOpacity>
            <Text className='font-roboto-bold text-white text-2xl'>
              Create Post
            </Text>
            <TouchableOpacity
              onPress={handleCreatePost}
              disabled={isLoading}
              className={`px-4 py-2 rounded-full ${isLoading ? 'bg-blue-400' : 'bg-blue-500'}`}
            >
              <Text className='text-white text-center font-bold'>
                {isLoading ? 'Posting...' : 'Post'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* border */}
          <View className='border-b border-[#292929] w-full mt-2'></View>

          {/* scroll view */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 72 }}
          >
            {/* Content area */}
            <View className='flex-1'>
              {/* Media preview */}
              <View className='flex-1 justify-center items-center bg-black/10 rounded-2xl mx-6 my-4'>
                {photo && (
                  <Image
                    source={{ uri: photo }}
                    style={{ width: '100%', height: 300, borderRadius: 12 }}
                    contentFit='contain'
                  />
                )}
                {video && (
                  <Video
                    ref={videoRef}
                    style={{ width: '100%', height: 300, borderRadius: 12 }}
                    source={{ uri: video }}
                    useNativeControls
                    resizeMode={ResizeMode.CONTAIN}
                    isLooping
                  />
                )}
                {audio && (
                  <View className='w-full p-4 bg-white/10 rounded-lg'>
                    <Text className='text-white text-center'>
                      Audio selected
                    </Text>
                    <Text className='text-gray-400 text-center text-xs mt-1'>
                      {audio.split('/').pop()}
                    </Text>
                  </View>
                )}
                {!photo && !video && !audio && (
                  <Text className='text-gray-400 text-center p-8'>
                    Select a media file to preview
                  </Text>
                )}
              </View>

              {/* Description input */}
              <View className='px-6 pt-4'>
                <Text className='text-white text-base font-medium mb-2'>
                  Description
                </Text>
                <View className='bg-white/10 rounded-2xl p-4 min-h-[100px]'>
                  <TextInput
                    className='text-white text-base flex-1'
                    placeholder="What's on your mind?"
                    placeholderTextColor='#9CA3AF'
                    multiline
                    value={description}
                    onChangeText={setDescription}
                    style={{ textAlignVertical: 'top', color: 'white' }}
                  />
                </View>
              </View>

              {/* Media selection buttons */}
              <View className='flex-row justify-between px-6 mt-6'>
                <TouchableOpacity
                  onPress={pickPhoto}
                  className='bg-[#FFFFFF0D] px-5 py-4 rounded-lg'
                >
                  <Feather name='image' size={40} color='#00E6E6' />
                  <Text className='text-white font-roboto-regular mt-1'>
                    Photo
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={pickVideo}
                  className='bg-[#FFFFFF0D] px-5 py-4 rounded-lg'
                >
                  <Feather name='video' size={40} color='#E60076' />
                  <Text className='text-white font-roboto-regular mt-1'>
                    Video
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={pickAudio}
                  className='bg-[#FFFFFF0D] px-5 py-4 rounded-lg'
                >
                  <Feather name='music' size={40} color='#F54900' />
                  <Text className='text-white font-roboto-regular mt-1'>
                    Music
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Share Options */}
              <View className='p-4 bg-[#FFFFFF0D] rounded-lg mt-7 flex-row justify-between items-center'>
                <View className='flex-row gap-3 items-center'>
                  <Feather name='facebook' size={24} color='white' />
                  <Text className='text-white'>Share with Facebook</Text>
                </View>
                <TouchableOpacity
                  onPress={() => setIsFacebook(!isFacebook)}
                  className='w-6 h-6 rounded-full border-[1.5px] border-white flex-row justify-center items-center'
                >
                  {isFacebook ? (
                    <View className='w-3.5 h-3.5 bg-blue-500 rounded-full' />
                  ) : (
                    <View className='w-3.5 h-3.5 bg-white rounded-full' />
                  )}
                </TouchableOpacity>
              </View>

              <View className='p-4 bg-[#FFFFFF0D] rounded-lg mt-7 flex-row justify-between items-center mb-8'>
                <View className='flex-row gap-3 items-center'>
                  <SimpleLineIcons
                    name='social-instagram'
                    size={24}
                    color='white'
                  />
                  <Text className='text-white'>Share with Instagram</Text>
                </View>
                <TouchableOpacity
                  onPress={() => setIsInstagram(!isInstagram)}
                  className='w-6 h-6 rounded-full border-[1.5px] border-white flex-row justify-center items-center'
                >
                  {isInstagram ? (
                    <View className='w-3.5 h-3.5 bg-blue-500 rounded-full' />
                  ) : (
                    <View className='w-3.5 h-3.5 bg-white rounded-full' />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default CreatePost;
