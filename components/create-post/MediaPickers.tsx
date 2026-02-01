import Feather from '@expo/vector-icons/Feather';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface MediaPickersProps {
  onPickPhoto: () => void;
  onPickVideo: () => void;
  onPickAudio: () => void;
}

const MediaPickers: React.FC<MediaPickersProps> = ({
  onPickPhoto,
  onPickVideo,
  onPickAudio,
}) => {
  return (
    <View className='flex-row justify-between px-6 mt-6'>
      <TouchableOpacity
        onPress={onPickPhoto}
        className='bg-[#F0F2F5] dark:bg-[#FFFFFF0D] px-5 py-4 rounded-lg items-center flex-1 mr-3'
        activeOpacity={0.7}
      >
        <Feather name='image' size={32} color='#00E6E6' />
        <Text className='text-black dark:text-white font-roboto-regular mt-2 text-xs'>
          Photo
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onPickVideo}
        className='bg-[#F0F2F5] dark:bg-[#FFFFFF0D] px-5 py-4 rounded-lg items-center flex-1 mr-3'
        activeOpacity={0.7}
      >
        <Feather name='video' size={32} color='#E60076' />
        <Text className='text-black dark:text-white font-roboto-regular mt-2 text-xs'>
          Video
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onPickAudio}
        className='bg-[#F0F2F5] dark:bg-[#FFFFFF0D] px-5 py-4 rounded-lg items-center flex-1'
        activeOpacity={0.7}
      >
        <Feather name='music' size={32} color='#F54900' />
        <Text className='text-black dark:text-white font-roboto-regular mt-2 text-xs'>
          Music
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default MediaPickers;
