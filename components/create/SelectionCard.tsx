import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface SelectionCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  onPress: () => void;
  gradientColors: string[];
}

const SelectionCard = ({
  icon,
  title,
  description,
  onPress,
  gradientColors,
}: SelectionCardProps) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} className='mb-6 '>
      <LinearGradient
        colors={gradientColors as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 12,
          padding: 16,
          borderWidth: 1,
          borderColor: 'blue',
        }}
      >
        <View className='flex-row items-center gap-4'>
          <View className='bg-[#F0F2F5] dark:bg-[#FFFFFF0D] p-4 rounded-2xl'>
            <Ionicons name={icon} size={40} color='black' />
          </View>
          <View className='flex-1'>
            <Text className='text-black dark:text-white font-roboto-bold text-xl mb-1'>
              {title}
            </Text>
            <Text className='text-black dark:text-white/80 font-roboto-regular text-sm'>
              {description}
            </Text>
          </View>
          <Ionicons name='chevron-forward' size={24} color='black' />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default SelectionCard;
