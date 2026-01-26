import MediaPickers from '@/components/create-post/MediaPickers';
import MediaPreview from '@/components/create-post/MediaPreview';
import GradientBackground from '@/components/main/GradientBackground';
import {
  useCreatePost,
  useEditPost,
  useUpdateScheduledPost,
} from '@/hooks/app/post'; // Import update hook
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router'; // Import useLocalSearchParams
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

const CreatePost = () => {
  const params = useLocalSearchParams();
  const isEditMode = !!params.postId;

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

  // Schedule state - only if NOT editing a published post
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

  const router = useRouter();
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
    // Populate media if editing
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

  // Handle Date Selection
  const onDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }

    if (selectedDate) {
      // Keep the current time, update the date
      const newDate = new Date(scheduledDate);
      newDate.setFullYear(selectedDate.getFullYear());
      newDate.setMonth(selectedDate.getMonth());
      newDate.setDate(selectedDate.getDate());
      setScheduledDate(newDate);
    }
  };

  // Handle Time Selection
  const onTimeChange = (event: any, selectedTime?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }

    if (selectedTime) {
      // Keep the current date, update the time
      const newDate = new Date(scheduledDate);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      setScheduledDate(newDate);
    }
  };

  const handlePost = async () => {
    // Media check only if creating new post or if we want to enforce media presence on update
    // (Assuming update also requires media, but if user didn't change it, we send the old one or handle it)
    // For now, let's assume we send media again if changed,
    // BUT the API patch might require media.
    // However, if we preserve the old URL, we can't upload it as a file.
    // If the valid URL is a remote URL (starts with http), we might need to handle it differently
    // or the backend supports keeping old media if 'media' field is empty.

    // Simplification: Require re-selecting media if editing?
    // OR: Check if `photo`/`video` starts with `http` -> don't append file?
    // Let's assume standard behavior: if it's a remote URL, backend shouldn't receive a file for it if not changed.
    // But FormData usually expects a file.
    // Let's try sending existing remote URL as string if not changed?
    // NOTE: React Native FormData usually handles {uri, type, name}.
    // If it's a string, we might just not append 'media' if we want to keep it?
    // User requested "update scheduled post", implying changing details.

    if (!photo && !video && !audio) {
      alert('Please select a media file (photo, video, or audio)');
      return;
    }

    if (!description.trim()) {
      alert('Please add a description');
      return;
    }

    const formData = new FormData();

    // Check if media is a remote URL (existing) or local file (new)
    const isRemote = (uri: string) => uri.startsWith('http');

    // Add media file ONLY if it is a local file (newly selected)
    // If it is remote, we probably don't need to send it, OR backend handles it.
    // Assuming backend keeps old media if not provided.

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
    // If remote, we might simply not append 'media'. The backend should likely persist existing media.

    // Add other fields
    formData.append('description', description);
    formData.append('shareToFacebook', isFacebook.toString());
    formData.append('shareToInstagram', isInstagram.toString());

    // Add schedule if enabled
    if (isScheduleMode) {
      // Check if date is in the future
      if (scheduledDate <= new Date()) {
        alert('Please select a future date and time for scheduling.');
        return;
      }
      formData.append('scheduledFor', scheduledDate.toISOString());
    }

    if (isEditMode) {
      console.log('--- Updating Post ---');
      console.log('Post ID:', params.postId);
      // @ts-ignore
      console.log('FormData:', formData);

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
              // alert('Post updated successfully!');
              router.back(); // Go back to profile/previous screen
            },
            onError: (error: any) => {
              // alert(error?.response?.data?.message || 'Failed to update post');
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
              // alert('Post updated successfully!');
              // Maybe go back or to scheduled posts?
              router.replace('/screens/profile/scheduled-posts');
            },
            onError: (error: any) => {
              // alert(error?.response?.data?.message || 'Failed to update post');
            },
          }
        );
      }
    } else {
      createPost(formData, {
        onSuccess: () => {
          // Reset form
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
          router.push('/(tabs)/home');
        },
        onError: (error: any) => {
          // alert(error?.response?.data?.message || 'Failed to create post');
        },
      });
    }
  };

  // Photo pick
  const pickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
      setVideo(result.assets[0].uri); // Keep uri for upload
      setVideoPlayerUri(null);
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
      setVideoPlayerUri(result.assets[0].uri);
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
        setVideoPlayerUri(null);
      }
    } catch (error) {
      console.error('Error picking audio:', error);
    }
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
              {isEditMode ? 'Edit Scheduled Post' : 'Create Post'}
            </Text>
            <TouchableOpacity
              onPress={handlePost}
              disabled={isLoading}
              className={`px-4 py-2 rounded-full ${isLoading ? 'bg-white/40' : 'bg-white'}`}
            >
              <Text className='text-black text-center font-bold'>
                {isLoading
                  ? isEditMode
                    ? 'Updating...'
                    : isScheduleMode
                      ? 'Scheduling...'
                      : 'Posting...'
                  : isEditMode
                    ? 'Update'
                    : isScheduleMode
                      ? 'Schedule'
                      : 'Post'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* border */}
          <View className='border-b border-[#292929] w-full mt-2'></View>

          {/* Schedule Toggle - Disable/Hide if Edit Mode is specifically for Scheduled Posts (implied always scheduled) OR allow changing back to post now? Allow flexible */
          /* Only show toggle if NOT editing a published post */}
          {!isPublishedConfig && (
            <View className='px-6 mt-4'>
              <View className='flex-row justify-between items-center'>
                <Text className='text-white text-base font-medium'>
                  {isScheduleMode ? 'Schedule Post' : 'Post Now'}
                </Text>
                <TouchableOpacity
                  onPress={() => setIsScheduleMode(!isScheduleMode)}
                  className='bg-[#FFFFFF0D] px-4 py-2 rounded-lg'
                >
                  <Text className='text-white text-sm'>
                    {isScheduleMode ? 'Post Now' : 'Schedule'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Schedule Options */}
          {isScheduleMode && (
            <View className='px-6 mt-4'>
              <View className='bg-[#FFFFFF0D] rounded-lg p-4'>
                <Text className='text-white text-base font-medium mb-3'>
                  Schedule Date & Time
                </Text>
                <View className='flex-row gap-3'>
                  {/* Date Picker Trigger */}
                  <TouchableOpacity
                    className='flex-1 bg-white/10 rounded-lg px-3 py-3'
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Text className='text-gray-400 text-xs mb-1'>Date</Text>
                    <Text className='text-white text-base'>
                      {scheduledDate.toLocaleDateString()}
                    </Text>
                  </TouchableOpacity>

                  {/* Time Picker Trigger */}
                  <TouchableOpacity
                    className='flex-1 bg-white/10 rounded-lg px-3 py-3'
                    onPress={() => setShowTimePicker(true)}
                  >
                    <Text className='text-gray-400 text-xs mb-1'>Time</Text>
                    <Text className='text-white text-base'>
                      {scheduledDate.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Date Picker Component */}
                {showDatePicker && (
                  <View>
                    {Platform.OS === 'ios' && (
                      <View className='flex-row justify-end mb-2'>
                        <TouchableOpacity
                          onPress={() => setShowDatePicker(false)}
                          className='bg-white/20 px-3 py-1 rounded-md'
                        >
                          <Text className='text-white font-medium'>Done</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                    <DateTimePicker
                      value={scheduledDate}
                      mode='date'
                      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                      onChange={onDateChange}
                      minimumDate={new Date()}
                      // themeVariant="dark" // Optional: if supported for dark mode look
                    />
                  </View>
                )}

                {/* Time Picker Component */}
                {showTimePicker && (
                  <View>
                    {Platform.OS === 'ios' && (
                      <View className='flex-row justify-end mb-2'>
                        <TouchableOpacity
                          onPress={() => setShowTimePicker(false)}
                          className='bg-white/20 px-3 py-1 rounded-md'
                        >
                          <Text className='text-white font-medium'>Done</Text>
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
            {/* Content area */}
            <View className='flex-1'>
              {/* Media preview */}
              {/* Media preview */}
              <View className='px-6 pt-4'>
                <MediaPreview
                  photo={photo}
                  video={video}
                  audio={audio}
                  videoPlayer={videoPlayer}
                />
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
              {/* Media selection buttons */}
              <MediaPickers
                onPickPhoto={pickPhoto}
                onPickVideo={pickVideo}
                onPickAudio={pickAudio}
              />

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
