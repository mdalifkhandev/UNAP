import BackButton from '@/components/button/BackButton';
import PostCard from '@/components/card/PostCard';
import MediaPickers from '@/components/create-post/MediaPickers';
import MediaPreview from '@/components/create-post/MediaPreview';
import GradientBackground from '@/components/main/GradientBackground';
import { useGetUBlastPosts, useSubmitUBlast, useUpdateUBlastPost } from '@/hooks/app/ublast';
import { useTranslateTexts } from '@/hooks/app/translate';
import useLanguageStore from '@/store/language.store';
import AntDesign from '@expo/vector-icons/AntDesign';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useVideoPlayer } from 'expo-video';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const UBlastSubmission = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  const isEditMode = !!params.postId;
  const { language } = useLanguageStore();
  const { data: t } = useTranslateTexts({
    texts: [
      'UBlast Submission',
      'Description',
      "What's on your mind?",
      'Schedule Post',
      'Schedule Date & Time',
      'Date',
      'Time',
      'Submit to UBlast',
      'Schedule Post',
      'Update Post',
      'Your UBlast Submissions',
      'Edit',
      'Eligibility Required',
      'Make sure you meet the eligibility requirements in the Trending tab before submitting.',
      'Scheduling...',
      'Submitting...',
      'Updating...',
      'Error',
      'Please select a media file (photo, video, or audio)',
      'Please add a description',
    ],
    targetLang: language,
    enabled: !!language && language !== 'EN',
  });
  const tx = (i: number, fallback: string) =>
    t?.translations?.[i] || fallback;

  // Form states
  const [description, setDescription] = useState(
    (params.description as string) || ''
  );
  const [photo, setPhoto] = useState<string | null>(null);
  const [video, setVideo] = useState<string | null>(null);
  const [audio, setAudio] = useState<string | null>(null);
  const [videoPlayerUri, setVideoPlayerUri] = useState<string | null>(null);
  const [isFacebook, setIsFacebook] = useState(
    params.shareToFacebook === 'true'
  );
  const [isInstagram, setIsInstagram] = useState(
    params.shareToInstagram === 'true'
  );

  // Scheduling states
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledDateTime, setScheduledDateTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const videoPlayer = useVideoPlayer(videoPlayerUri || '', player => {
    player.loop = true;
    player.play();
  });

  const { mutate: submitUBlast, isPending: isSubmitting } = useSubmitUBlast();
  const { mutate: updateUBlastPost, isPending: isUpdating } =
    useUpdateUBlastPost();

  const { data: ublastData, refetch: refetchUBlast } = useGetUBlastPosts();

  console.log(JSON.stringify(ublastData, null, 2));

  const isLoading = isSubmitting || isUpdating;



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

  const handleSubmit = async () => {
    if (!photo && !video && !audio) {
      Alert.alert(
        tx(17, 'Error'),
        tx(18, 'Please select a media file (photo, video, or audio)')
      );
      return;
    }

    if (!description.trim()) {
      Alert.alert(tx(17, 'Error'), tx(19, 'Please add a description'));
      return;
    }

    // Validate scheduled time if scheduling is enabled
    if (!validateScheduledTime()) {
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
      // formData.append('mediaType', 'image');
    } else if (video && !isRemote(video)) {
      const filename = video.split('/').pop() || 'video.mp4';
      const match = /\.(\w+)$/.exec(filename);
      const ext = match?.[1]?.toLowerCase() || 'mp4';
      formData.append('media', {
        uri: video,
        name: filename,
        type: `video/${ext === 'mov' ? 'quicktime' : 'mp4'}`,
      } as any);
      // formData.append('mediaType', 'video');
    } else if (audio && !isRemote(audio)) {
      const filename = audio.split('/').pop() || 'audio.mp3';
      const match = /\.(\w+)$/.exec(filename);
      const ext = match?.[1]?.toLowerCase() || 'mp3';
      formData.append('media', {
        uri: audio,
        name: filename,
        type: `audio/${ext === 'wav' ? 'wav' : 'mpeg'}`,
      } as any);
      // formData.append('mediaType', 'audio');
    }

    formData.append('content', description);
    formData.append('title', 'UBlast Post');

    // Add scheduling information
    // formData.append('proposedDate', isScheduled.toString());


    if (isScheduled) {
      formData.append('proposedDate', scheduledDateTime.toISOString());
    }
    console.log(JSON.stringify(formData, null, 2));

    if (isEditMode) {
      updateUBlastPost(
        { postId: params.postId as string, formData },
        {
          onSuccess: () => {
            resetForm();
            refetchUBlast();
            router.back();
          },
        }
      );
    } else {
      submitUBlast(formData, {
        onSuccess: () => {
          resetForm();
          refetchUBlast();
        },
      });
    }
  };

  const resetForm = () => {
    setPhoto(null);
    setVideo(null);
    setVideoPlayerUri(null);
    setAudio(null);
    setDescription('');
    setIsFacebook(false);
    setIsInstagram(false);

    // Reset scheduling states
    setIsScheduled(false);
    setScheduledDateTime(new Date());
    setShowDatePicker(false);
    setShowTimePicker(false);
  };

  const pickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
    });
    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
      setVideo(null);
      setVideoPlayerUri(null);
      setAudio(null);
    }
  };

  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['videos'],
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

  const handleEditPost = (post: any) => {
    router.push({
      pathname: '/screens/ublast/ublast-submission',
      params: {
        postId: post._id,
        description: post.description,
        mediaUrl: post.mediaUrl,
        mediaType: post.mediaType,
        shareToFacebook: post.shareToFacebook ? 'true' : 'false',
        shareToInstagram: post.shareToInstagram ? 'true' : 'false',
      },
    });
  };

  // Scheduling helper functions
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const validateScheduledTime = () => {
    if (!isScheduled) return true;

    if (scheduledDateTime <= new Date()) {
      Alert.alert('Error', 'Scheduled time must be in the future');
      return false;
    }

    return true;
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }

    if (selectedDate) {
      const newDate = new Date(scheduledDateTime);
      newDate.setFullYear(selectedDate.getFullYear());
      newDate.setMonth(selectedDate.getMonth());
      newDate.setDate(selectedDate.getDate());
      setScheduledDateTime(newDate);
    }
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }

    if (selectedTime) {
      const newDate = new Date(scheduledDateTime);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      setScheduledDateTime(newDate);
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
        <View className='mt-3 flex-row items-center mx-6 justify-between'>
          <BackButton />
          <Text className='font-roboto-bold text-black dark:text-white text-2xl'>
            {tx(0, 'UBlast Submission')}
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <View className='border-b border-black/20 dark:border-[#FFFFFF0D] dark:border-[#FFFFFF0D] w-full mt-2'></View>

        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 24 }}
          showsVerticalScrollIndicator={false}
        >
          {/* UBlast Submission Form */}
          <View className='bg-[#F0F2F5] dark:bg-[#FFFFFF0D] rounded-3xl p-6 border border-black/20 dark:border-[#FFFFFF0D] dark:border-[#FFFFFF0D] mb-6'>
            {/* Media Preview */}
            <MediaPreview
              photo={photo}
              video={video}
              audio={audio}
              videoPlayer={videoPlayer}
            />

            {/* Description */}
            <View className='mt-4'>
              <Text className='text-black dark:text-white text-base font-medium mb-2'>
                {tx(1, 'Description')}
              </Text>
              <View className='bg-[#F0F2F5] dark:bg-[#FFFFFF0D] rounded-2xl px-3  min-h-[50px]'>
                <TextInput
                  className='text-black dark:text-white text-base '
                  placeholder={tx(2, "What's on your mind?")}
                  placeholderTextColor='#9CA3AF'
                  multiline
                  value={description}
                  textAlignVertical='top'
                  onChangeText={setDescription}
                  style={{ textAlignVertical: 'top', color: 'white' }}
                />
              </View>
            </View>

            {/* Media Pickers */}
            <MediaPickers
              onPickPhoto={pickPhoto}
              onPickVideo={pickVideo}
              onPickAudio={pickAudio}
            />

            {/* Scheduling Options */}
            <View className='mt-4'>
              <View className='flex-row justify-between items-center mb-3'>
                <Text className='text-black dark:text-white text-base font-medium'>
                  {tx(3, 'Schedule Post')}
                </Text>
                <TouchableOpacity
                  onPress={() => setIsScheduled(!isScheduled)}
                  className='w-6 h-6 rounded-full border-[1.5px] border-white flex-row justify-center items-center'
                >
                  {isScheduled ? (
                    <View className='w-3.5 h-3.5 bg-white rounded-full' />
                  ) : (
                    <View className='w-3.5 h-3.5 bg-black rounded-full' />
                  )}
                </TouchableOpacity>
              </View>

              {isScheduled && (
                <View className='bg-[#F0F2F5] dark:bg-[#FFFFFF0D] rounded-lg p-4'>
                  <Text className='text-black dark:text-white text-base font-medium mb-3'>
                    {tx(4, 'Schedule Date & Time')}
                  </Text>
                  <View className='flex-row gap-3'>
                    <TouchableOpacity
                      className='flex-1 bg-[#F0F2F5] dark:bg-[#FFFFFF0D] rounded-lg px-3 py-3'
                      onPress={() => setShowDatePicker(true)}
                    >
                      <Text className='text-gray-400 text-xs mb-1'>
                        {tx(5, 'Date')}
                      </Text>
                      <Text className='text-black dark:text-white text-base'>
                        {scheduledDateTime.toLocaleDateString()}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      className='flex-1 bg-[#F0F2F5] dark:bg-[#FFFFFF0D] rounded-lg px-3 py-3'
                      onPress={() => setShowTimePicker(true)}
                    >
                      <Text className='text-gray-400 text-xs mb-1'>
                        {tx(6, 'Time')}
                      </Text>
                      <Text className='text-black dark:text-white text-base'>
                        {scheduledDateTime.toLocaleTimeString([], {
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
                            <Text className='text-black dark:text-white font-medium'>Done</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                      <DateTimePicker
                        value={scheduledDateTime}
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
                            <Text className='text-black dark:text-white font-medium'>Done</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                      <DateTimePicker
                        value={scheduledDateTime}
                        mode='time'
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={onTimeChange}
                      />
                    </View>
                  )}
                </View>
              )}
            </View>

            {/* Social Sharing Options */}

            {/* Submit Button */}
            <TouchableOpacity
              className='bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-4 items-center mt-6'
              onPress={handleSubmit}
              disabled={isLoading}
            >
              <Text className='text-black dark:text-white font-roboto-bold text-lg'>
                {isLoading
                  ? isEditMode
                    ? tx(16, 'Updating...')
                    : isScheduled
                      ? tx(14, 'Scheduling...')
                      : tx(15, 'Submitting...')
                  : isEditMode
                    ? tx(9, 'Update Post')
                    : isScheduled
                      ? tx(8, 'Schedule Post')
                      : tx(7, 'Submit to UBlast')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* UBlast Posts List */}
          {ublastData?.submissions && ublastData.submissions.length > 0 && (
            <View className='mt-6'>
              <Text className='text-black dark:text-white font-roboto-bold text-xl mb-4'>
                {tx(10, 'Your UBlast Submissions')}
              </Text>
              <View className='space-y-4'>
                {ublastData.submissions.map((post: any) => (
                  <View key={post._id} className='relative'>
                    <PostCard
                      post={post}
                      showOwnerActions={true}
                      hideFollowButton={true}
                      hideActions={true}
                    />
                    {/* Edit Button in Top Right */}
                    <TouchableOpacity
                      className='absolute top-4 right-4 bg-[#F0F2F5] dark:bg-[#FFFFFF0D] px-3 py-1.5 rounded-full border border-black/20 dark:border-[#FFFFFF0D] dark:border-[#FFFFFF0D]'
                      onPress={() => handleEditPost(post)}
                    >
                      <Text className='text-black dark:text-white font-roboto-medium text-xs'>
                        {tx(11, 'Edit')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Eligibility Notice */}
          <View className='mt-6 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-4'>
            <View className='flex-row gap-3 items-start'>
              <AntDesign name='info-circle' size={24} color='#eab308' />
              <View className='flex-1'>
                <Text className='text-yellow-500 font-roboto-semibold mb-1'>
                  {tx(12, 'Eligibility Required')}
                </Text>
                <Text className='text-yellow-500/80 font-roboto-regular text-sm'>
                  {tx(
                    13,
                    'Make sure you meet the eligibility requirements in the Trending tab before submitting.'
                  )}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
};
export default UBlastSubmission;
