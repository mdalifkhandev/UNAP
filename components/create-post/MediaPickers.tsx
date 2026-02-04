import Feather from '@expo/vector-icons/Feather';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useTranslateTexts } from '@/hooks/app/translate';
import useLanguageStore from '@/store/language.store';

interface MediaPickersProps {
  onPickPhoto: () => void;
  onPickVideo: () => void;
  onPickAudio: () => void;
  disablePhoto?: boolean;
  disableVideo?: boolean;
  disableAudio?: boolean;
}

const MediaPickers: React.FC<MediaPickersProps> = ({
  onPickPhoto,
  onPickVideo,
  onPickAudio,
  disablePhoto = false,
  disableVideo = false,
  disableAudio = false,
}) => {
  const { language } = useLanguageStore();
  const { data: t } = useTranslateTexts({
    texts: ['Photo', 'Video', 'Music'],
    targetLang: language,
    enabled: !!language && language !== 'EN',
  });
  const tx = (i: number, fallback: string) =>
    t?.translations?.[i] || fallback;

  return (
    <View className='flex-row justify-between px-6 mt-6'>
      <TouchableOpacity
        onPress={onPickPhoto}
        disabled={disablePhoto}
        className={`bg-[#F0F2F5] dark:bg-[#FFFFFF0D] px-5 py-4 rounded-lg items-center flex-1 mr-3 ${disablePhoto ? 'opacity-40' : ''}`}
        activeOpacity={0.7}
      >
        <Feather name='image' size={32} color='#00E6E6' />
        <Text className='text-black dark:text-white font-roboto-regular mt-2 text-xs'>
          {tx(0, 'Photo')}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onPickVideo}
        disabled={disableVideo}
        className={`bg-[#F0F2F5] dark:bg-[#FFFFFF0D] px-5 py-4 rounded-lg items-center flex-1 mr-3 ${disableVideo ? 'opacity-40' : ''}`}
        activeOpacity={0.7}
      >
        <Feather name='video' size={32} color='#E60076' />
        <Text className='text-black dark:text-white font-roboto-regular mt-2 text-xs'>
          {tx(1, 'Video')}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onPickAudio}
        disabled={disableAudio}
        className={`bg-[#F0F2F5] dark:bg-[#FFFFFF0D] px-5 py-4 rounded-lg items-center flex-1 ${disableAudio ? 'opacity-40' : ''}`}
        activeOpacity={0.7}
      >
        <Feather name='music' size={32} color='#F54900' />
        <Text className='text-black dark:text-white font-roboto-regular mt-2 text-xs'>
          {tx(2, 'Music')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default MediaPickers;
