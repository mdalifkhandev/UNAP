import useThemeStore from '@/store/theme.store';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

const ShadowButton = ({
  onPress,
  textColor,
  backGroundColor,
  text,
  className,
  useThemeColors = true,
}: {
  onPress?: () => void;
  textColor?: string;
  backGroundColor?: string;
  text: string;
  className?: string;
  useThemeColors?: boolean;
}) => {
  const { mode } = useThemeStore();
  const isLight = mode === 'light';
  const resolvedTextColor = useThemeColors
    ? isLight
      ? 'white'
      : '#2B2B2B'
    : textColor ?? (isLight ? 'white' : '#2B2B2B');
  const resolvedBackground = useThemeColors
    ? isLight
      ? 'black'
      : '#E8EBEE'
    : backGroundColor ?? (isLight ? 'black' : '#E8EBEE');
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`p-3 rounded-full ${className}`}
      style={{
        backgroundColor: resolvedBackground,
        shadowColor: '#ffffff',
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 5,
      }}
    >
      <Text
        className='font-roboto-bold  text-center'
        style={{
          color: resolvedTextColor,
        }}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};

export default ShadowButton;
