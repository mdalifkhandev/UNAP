import { useTranslateTexts } from '@/hooks/app/translate';
import useLanguageStore from '@/store/language.store';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

const SuggestedArtistsCard = ({ className }: { className?: string }) => {
  const { language } = useLanguageStore();
  const { data: t } = useTranslateTexts({
    texts: [
      'Suggested Artists',
      'Digital Artist',
      'Fitness Trainer',
      'Photographer',
      'Music Producer',
      'Dancer',
      'Graphic Designer',
      'Fashion Model',
      'Videographer',
      'Makeup Artist',
      'DJ',
    ],
    targetLang: language,
    enabled: !!language && language !== 'EN',
  });
  const tx = (i: number, fallback: string) =>
    t?.translations?.[i] || fallback;

  const suggestedPrifile = [
    {
      id: '1',
      name: 'Ava Martinez',
      profession: tx(1, 'Digital Artist'),
      image: {
        uri: 'https://demo-source.imgix.net/head_shot.jpg',
      },
    },
    {
      id: '2',
      name: 'Liam Anderson',
      profession: tx(2, 'Fitness Trainer'),
      image: {
        uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
      },
    },
    {
      id: '3',
      name: 'Mia Rodriguez',
      profession: tx(3, 'Photographer'),
      image: {
        uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
      },
    },
    {
      id: '4',
      name: 'Noah Bennett',
      profession: tx(4, 'Music Producer'),
      image: {
        uri: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
      },
    },
    {
      id: '5',
      name: 'Sophia Chen',
      profession: tx(5, 'Dancer'),
      image: {
        uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
      },
    },
    {
      id: '6',
      name: 'Ethan Parker',
      profession: tx(6, 'Graphic Designer'),
      image: {
        uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
      },
    },
    {
      id: '7',
      name: 'Isabella Wong',
      profession: tx(7, 'Fashion Model'),
      image: {
        uri: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
      },
    },
    {
      id: '8',
      name: 'Lucas Silva',
      profession: tx(8, 'Videographer'),
      image: {
        uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
      },
    },
    {
      id: '9',
      name: 'Emma Johnson',
      profession: tx(9, 'Makeup Artist'),
      image: {
        uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
      },
    },
    {
      id: '10',
      name: 'Oliver Smith',
      profession: tx(10, 'DJ'),
      image: {
        uri: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6',
      },
    },
  ];

  return (
    <View
      className={`bg-[#F0F2F5] dark:bg-[#FFFFFF0D] rounded-3xl ${className} border border-black/20 dark:border-[#FFFFFF0D] dark:border-[#FFFFFF0D]`}
    >
      <Text className='text-primary dark:text-white font-roboto-bold text-xl px-4 pt-4'>
        {tx(0, 'Suggested Artists')}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingVertical: 24,
          gap: 16,
        }}
      >
        {suggestedPrifile.map((item, index) => (
          <TouchableOpacity
            onPress={() =>
              item.id
                ? router.push({
                    pathname: '/screens/profile/other-profile',
                    params: { id: item.id },
                  })
                : router.push('/(tabs)/profile')
            }
            key={index}
            className='items-center'
            style={{ width: 80 }}
          >
            <Image
              source={{ uri: item.image.uri }}
              style={{
                width: 60,
                height: 60,
                borderRadius: 100,
              }}
              contentFit='cover'
            />
            <Text
              className='font-roboto-semibold text-sm text-primary dark:text-white mt-2 text-center'
              numberOfLines={1}
            >
              {item.name}
            </Text>
            <Text
              className='font-roboto-regular text-xs text-secondary dark:text-white/80 mt-0.5 text-center'
              numberOfLines={1}
            >
              {item.profession}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default SuggestedArtistsCard;
