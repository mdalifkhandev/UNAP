import MediaPickers from '@/components/create-post/MediaPickers';
import MediaPreview from '@/components/create-post/MediaPreview';
import SelectionCard from '@/components/create/SelectionCard';
import GradientBackground from '@/components/main/GradientBackground';
import {
  useCreatePost,
  useEditPost,
  useUpdateScheduledPost,
} from '@/hooks/app/post';
import useThemeStore from '@/store/theme.store';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useVideoPlayer } from 'expo-video';
import React, { useEffect, useState } from 'react';
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
import Toast from 'react-native-toast-message';

const CreatePost = () => {
  const { mode: colorMode } = useThemeStore();
  const isLight = colorMode === 'light';
  const params = useLocalSearchParams();
  const isEditMode = !!params.postId;
  const router = useRouter();

  // Selection mode: 'selection' | 'post-create'
  const [mode, setMode] = useState<'selection' | 'post-create'>(
    isEditMode ? 'post-create' : 'selection'
  );

  const [isFacebook, setIsFacebook] = useState(
    params.shareToFacebook === 'true'
  );
  const [isInstagram, setIsInstagram] = useState(
    params.shareToInstagram === 'true'
  );
  const [description, setDescription] = useState(
    (params.description as string) || ''
  );

  const isPublishedConfig = params.isPublishedConfig === 'true';

  const [isScheduleMode, setIsScheduleMode] = useState(
    isEditMode && !isPublishedConfig ? true : false
  );
  const [scheduledDate, setScheduledDate] = useState(
    params.scheduledFor ? new Date(params.scheduledFor as string) : new Date()
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [photo, setPhoto] = useState<string | null>(null);
  const [video, setVideo] = useState<string | null>(null);
  const [audio, setAudio] = useState<string | null>(null);
  const [videoPlayerUri, setVideoPlayerUri] = useState<string | null>(null);
  const videoPlayer = useVideoPlayer(videoPlayerUri || '', player => {
    player.loop = true;
    player.play();
  });

  const { mutate: createPost, isPending: isCreating } = useCreatePost();
  const { mutate: updateScheduledPost, isPending: isUpdatingScheduled } =
    useUpdateScheduledPost();
  const { mutate: editPost, isPending: isEditingPublished } = useEditPost();

  const isLoading = isCreating || isUpdatingScheduled || isEditingPublished;

  useEffect(() => {
    if (isEditMode && params.mediaUrl && params.mediaType) {
      const type = params.mediaType as string;
      const url = params.mediaUrl as string;
      if (type === 'image') {
        setPhoto(url);
      } else if (type === 'video') {
        setVideo(url);
        setVideoPlayerUri(url);
      } else if (type === 'audio') {
        setAudio(url);
      }
    }
  }, [isEditMode, params]);

  const onDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }

    if (selectedDate) {
      const now = new Date();
      const newDate = new Date(selectedDate);
      newDate.setHours(now.getHours());
      newDate.setMinutes(now.getMinutes());
      setScheduledDate(newDate);
    }
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }

    if (selectedTime) {
      const newDate = new Date(scheduledDate);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      setScheduledDate(newDate);
    }
  };

  const handlePost = async () => {
    if (!photo && !video && !audio) {
      alert('Please select a media file (photo, video, or audio)');
      return;
    }

    if (!description.trim()) {
      alert('Please add a description');
      return;
    }

    const formData = new FormData();

    const isRemote = (uri: string) => uri.startsWith('http');

    if (photo && !isRemote(photo)) {
      const filename = photo.split('/').pop() || 'photo.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const ext = match?.[1]?.toLowerCase() || 'jpg';
      formData.append('media', {
        uri: photo,
        name: filename,
        type: `image/${ext === 'png' ? 'png' : 'jpeg'}`,
      } as any);
      formData.append('mediaType', 'image');
    } else if (video && !isRemote(video)) {
      const filename = video.split('/').pop() || 'video.mp4';
      const match = /\.(\w+)$/.exec(filename);
      const ext = match?.[1]?.toLowerCase() || 'mp4';
      formData.append('media', {
        uri: video,
        name: filename,
        type: `video/${ext === 'mov' ? 'quicktime' : 'mp4'}`,
      } as any);
      formData.append('mediaType', 'video');
    } else if (audio && !isRemote(audio)) {
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

    formData.append('description', description);
    formData.append('shareToFacebook', isFacebook.toString());
    formData.append('shareToInstagram', isInstagram.toString());

    if (isScheduleMode) {
      if (scheduledDate <= new Date()) {
        alert('Please select a future date and time for scheduling.');
        return;
      }
      formData.append('scheduledFor', scheduledDate.toISOString());
    }

    if (isEditMode) {
      if (isPublishedConfig) {
        editPost(
          { postId: params.postId as string, formData },
          {
            onSuccess: () => {
              setPhoto(null);
              setVideo(null);
              setVideoPlayerUri(null);
              setAudio(null);
              setDescription('');
              setIsFacebook(false);
              setIsInstagram(false);
              setIsScheduleMode(false);
              router.back();
            },
            onError: (error: any) => {
              Toast.show({
                type: 'error',
                text1: 'Post Update Failed',
                text2: error?.response?.data?.message || error.message,
              });
            },
          }
        );
      } else {
        updateScheduledPost(
          { postId: params.postId as string, formData },
          {
            onSuccess: () => {
              setPhoto(null);
              setVideo(null);
              setVideoPlayerUri(null);
              setAudio(null);
              setDescription('');
              setIsFacebook(false);
              setIsInstagram(false);
              setIsScheduleMode(false);

              router.replace('/screens/profile/scheduled-posts');
            },
            onError: (error: any) => {
              Toast.show({
                type: 'error',
                text1: 'Post Update Failed',
                text2: error?.response?.data?.message || error.message,
              });
            },
          }
        );
      }
    } else {
      createPost(formData, {
        onSuccess: () => {
          setPhoto(null);
          setVideo(null);
          setVideoPlayerUri(null);
          setAudio(null);
          setDescription('');
          setIsFacebook(false);
          setIsInstagram(false);
          setIsScheduleMode(false);

          alert(
            isScheduleMode
              ? 'Post scheduled successfully!'
              : 'Post created successfully!'
          );
          setMode('selection');
        },
        onError: (error: any) => {
          Toast.show({
            type: 'error',
            text1: 'Post Creation Failed',
            text2: error?.response?.data?.message || error.message,
          });
        },
      });
    }
  };

  const pickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
      setVideo(result.assets[0].uri);
      setVideoPlayerUri(null);
      setAudio(null);
    }
  };

  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 1,
    });
    if (!result.canceled) {
      setVideo(result.assets[0].uri);
      setVideoPlayerUri(result.assets[0].uri);
      setPhoto(null);
      setAudio(null);
    }
  };

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
        setVideoPlayerUri(null);
      }
    } catch (error) {
      console.error('Error picking audio:', error);
    }
  };

  if (mode === 'selection') {
    return (
      <GradientBackground>
        <StatusBar style='dark' />
        <SafeAreaView className='flex-1' edges={['top', 'left', 'right']}>
          <View className='mt-3 mx-6'>
            <Text className='font-roboto-bold text-primary dark:text-white text-3xl text-center mb-2'>
              Create
            </Text>
            <Text className='font-roboto-regular text-secondary dark:text-white/80 text-center mb-8'>
              Choose what you want to create
            </Text>
          </View>

          <View className='border-b border-black/20 dark:border-[#FFFFFF0D] dark:border-[#FFFFFF0D] w-full'></View>

          <ScrollView
            contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 40 }}
            showsVerticalScrollIndicator={false}
          >
            <SelectionCard
              icon='camera'
              title='UPost Create'
              description='Share photos, videos, and audio with your followers'
              onPress={() => setMode('post-create')}
              gradientColors={['#667eea', '#764ba2']}
            />

            <SelectionCard
              icon='rocket'
              title='UBlast Submission'
              description='Submit your content to trending and reach more people'
              onPress={() => router.push('/screens/ublast/ublast-submission')}
              gradientColors={['#f093fb', '#f5576c']}
            />
          </ScrollView>
        </SafeAreaView>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <StatusBar style='dark' />
      <SafeAreaView className='flex-1' edges={['top', 'left', 'right']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          {/* header */}
          <View className='mt-3 flex-row items-center mx-6 justify-between'>
            <TouchableOpacity
              onPress={() => {
                if (isEditMode) {
                  router.back();
                } else {
                  setMode('selection');
                }
              }}
            >
              <AntDesign
                name='close'
                size={22}
                color={isLight ? 'black' : 'white'}
              />
            </TouchableOpacity>
            <Text className='font-roboto-bold text-black dark:text-white text-2xl'>
              {isEditMode ? 'Edit Post' : 'Create Post'}
            </Text>
            <TouchableOpacity
              onPress={handlePost}
              disabled={isLoading}
              className={`px-4 py-2 rounded-full ${
                isLoading
                  ? 'bg-white/40 dark:bg-white/20'
                  : 'bg-white dark:bg-[#FFFFFF0D]'
              }`}
            >
              <Text className='text-black dark:text-white text-center font-bold'>
                {isLoading
                  ? isEditMode
                    ? 'Updating...'
                    : isScheduleMode
                      ? 'UScheduling...'
                      : 'UPosting...'
                  : isEditMode
                    ? 'Update'
                    : isScheduleMode
                      ? 'USchedule'
                      : 'UPost'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* border */}
          <View className='border-b border-black/20 dark:border-[#FFFFFF0D] dark:border-[#FFFFFF0D] w-full mt-2'></View>

          {/* Schedule Toggle */}
          {!isPublishedConfig && (
            <View className='px-6 mt-4'>
              <View className='flex-row justify-between items-center'>
                <Text className='text-black dark:text-white text-base font-medium'>
                  {isScheduleMode ? 'Schedule Post' : 'Post Now'}
                </Text>
                <TouchableOpacity
                  onPress={() => setIsScheduleMode(!isScheduleMode)}
                  className='bg-[#F0F2F5] dark:bg-[#FFFFFF0D] px-4 py-2 rounded-lg'
                >
                  <Text className='text-black dark:text-white text-sm'>
                    {isScheduleMode ? 'Post Now' : 'Schedule'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Schedule Options */}
          {isScheduleMode && (
            <View className='px-6 mt-4'>
              <View className='bg-[#F0F2F5] dark:bg-[#FFFFFF0D] rounded-lg p-4'>
                <Text className='text-black dark:text-white text-base font-medium mb-3'>
                  Schedule Date & Time
                </Text>
                <View className='flex-row gap-3'>
                  <TouchableOpacity
                    className='flex-1 bg-[#F0F2F5] dark:bg-[#FFFFFF0D] rounded-lg px-3 py-3'
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Text className='text-gray-400 text-xs mb-1'>Date</Text>
                    <Text className='text-black dark:text-white text-base'>
                      {scheduledDate.toLocaleDateString()}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className='flex-1 bg-[#F0F2F5] dark:bg-[#FFFFFF0D] rounded-lg px-3 py-3'
                    onPress={() => setShowTimePicker(true)}
                  >
                    <Text className='text-gray-400 text-xs mb-1'>Time</Text>
                    <Text className='text-black dark:text-white text-base'>
                      {scheduledDate.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </TouchableOpacity>
                </View>

                {showDatePicker && (
                  <View>
                    {Platform.OS === 'ios' && (
                      <View className='flex-row justify-end mb-2'>
                        <TouchableOpacity
                          onPress={() => setShowDatePicker(false)}
                          className='bg-[#F0F2F5] dark:bg-[#FFFFFF0D] px-3 py-1 rounded-md'
                        >
                          <Text className='text-black dark:text-white font-medium'>
                            Done
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                    <DateTimePicker
                      value={scheduledDate}
                      mode='date'
                      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                      onChange={onDateChange}
                      minimumDate={new Date()}
                    />
                  </View>
                )}

                {showTimePicker && (
                  <View>
                    {Platform.OS === 'ios' && (
                      <View className='flex-row justify-end mb-2'>
                        <TouchableOpacity
                          onPress={() => setShowTimePicker(false)}
                          className='bg-[#F0F2F5] dark:bg-[#FFFFFF0D] px-3 py-1 rounded-md'
                        >
                          <Text className='text-black dark:text-white font-medium'>
                            Done
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                    <DateTimePicker
                      value={scheduledDate}
                      mode='time'
                      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                      onChange={onTimeChange}
                    />
                  </View>
                )}
              </View>
            </View>
          )}

          {/* scroll view */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 72 }}
          >
            <View className='flex-1'>
              <View className='px-6 pt-4'>
                <MediaPreview
                  photo={photo}
                  video={video}
                  audio={audio}
                  videoPlayer={videoPlayer}
                />
              </View>

              <View className='px-6 pt-4'>
                <Text className='text-black dark:text-white text-base font-medium mb-2'>
                  Description
                </Text>
                <View className='bg-[#F0F2F5] dark:bg-[#FFFFFF0D] rounded-2xl p-4 min-h-[100px]'>
                  <TextInput
                    className='text-black dark:text-white text-base flex-1'
                    placeholder="What's on your mind?"
                    placeholderTextColor='#9CA3AF'
                    multiline
                    value={description}
                    onChangeText={setDescription}
                    style={{ textAlignVertical: 'top', color: 'white' }}
                  />
                </View>
              </View>

              <MediaPickers
                onPickPhoto={pickPhoto}
                onPickVideo={pickVideo}
                onPickAudio={pickAudio}
              />

              <View className='mx-5 p-4 bg-[#F0F2F5] dark:bg-[#FFFFFF0D] rounded-lg mt-7 flex-row justify-between items-center'>
                <View className='flex-row gap-3 items-center'>
                  <Feather
                    name='facebook'
                    size={24}
                    color={isLight ? 'black' : 'white'}
                  />
                  <Text className='text-black dark:text-white'>
                    Share with Facebook
                  </Text>
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

              <View className='mx-5 p-4 bg-[#F0F2F5] dark:bg-[#FFFFFF0D] rounded-lg mt-7 flex-row justify-between items-center mb-8'>
                <View className='flex-row gap-3 items-center'>
                  <SimpleLineIcons
                    name='social-instagram'
                    size={24}
                    color={isLight ? 'black' : 'white'}
                  />
                  <Text className='text-black dark:text-white'>
                    Share with Instagram
                  </Text>
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
