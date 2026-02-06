import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAudioPlayer } from 'expo-audio';
import { Image } from 'expo-image';
import { VideoView } from 'expo-video';
import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

interface MediaPreviewProps {
  photo: string | null;
  video: string | null;
  audio: string | null;
  videoPlayer: any;
}

const MediaPreview: React.FC<MediaPreviewProps> = ({
  photo,
  video,
  audio,
  videoPlayer,
}) => {
  const isFocused = useIsFocused();
  // Setup Audio Player using expo-audio's hook
  // Note: useAudioPlayer usually returns a player object.
  // We handle the case where audio might be null safely by passing an empty string or checking inside.
  const player = useAudioPlayer(audio || '');
  React.useEffect(() => {
    if (!isFocused || !audio) {
      player.pause();
    }
  }, [isFocused, audio, player]);

  const togglePlayback = () => {
    if (player.playing) {
      player.pause();
    } else {
      player.play();
    }
  };

  const formatTime = (seconds: number) => {
    // Handle null/NaN/undefined safely
    const safeSeconds = Number(seconds) || 0;
    const totalSeconds = Math.floor(safeSeconds);
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!photo && !video && !audio) {
    return (
      <View className='w-full h-[100px] justify-center items-center bg-black/10 dark:bg-[#FFFFFF0D] dark:bg-white/10 rounded-2xl mb-4 border border-dashed border-black/20 dark:border-[#FFFFFF0D] dark:border-[#FFFFFF0D]'>
        <Feather name='image' size={40} color='#666' style={{ opacity: 0.5 }} />
        <Text className='text-gray-400 text-center mt-4 font-roboto-regular'>
          Select media to preview
        </Text>
      </View>
    );
  }

  return (
    <View className='w-full h-[300px] justify-center items-center bg-black/10 dark:bg-[#FFFFFF0D] dark:bg-white/10 rounded-2xl mb-4 overflow-hidden relative'>
      {/* Photo Preview */}
      {photo && (
        <Image
          source={{ uri: photo }}
          style={{ width: '100%', height: '100%' }}
          contentFit='cover'
          transition={200}
        />
      )}

      {/* Video Preview */}
      {video && (
        <VideoView
          style={{ width: '100%', height: '100%' }}
          player={videoPlayer}
          nativeControls
        />
      )}

      {/* Audio Preview */}
      {audio && (
        <View className='w-full h-full justify-center items-center bg-gray-900/50 p-6'>
          <View className='w-16 h-16 rounded-full bg-[#F0F2F5] dark:bg-[#FFFFFF0D] items-center justify-center mb-4'>
            <Feather name='music' size={32} color='#F54900' />
          </View>

          <Text
            className='text-black dark:text-white font-roboto-medium text-lg mb-1'
            numberOfLines={1}
          >
            {audio.split('/').pop()}
          </Text>
          <Text className='text-gray-400 text-sm mb-6'>Audio Preview</Text>

          <View className='flex-row items-center gap-4 w-full justify-center'>
            <Text className='text-gray-400 text-xs w-10 text-right'>
              {formatTime(player.currentTime)}
            </Text>

            <TouchableOpacity
              onPress={togglePlayback}
              disabled={!player.isLoaded}
              className='w-14 h-14 rounded-full bg-white items-center justify-center'
            >
              {/* Check if we are loading. expo-audio might use different flags, strictly checking loading state */}
              {/* If explicit loading state isn't exposed, we rely on isLoaded or similar behavior */}
              {!player.isLoaded ? (
                <ActivityIndicator color='black' />
              ) : (
                <Ionicons
                  name={player.playing ? 'pause' : 'play'}
                  size={24}
                  color='black'
                  style={{ marginLeft: player.playing ? 0 : 2 }}
                />
              )}
            </TouchableOpacity>

            <Text className='text-gray-400 text-xs w-10'>
              {formatTime(player.duration)}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default MediaPreview;
