import useThemeStore from '@/store/theme.store';
import Entypo from '@expo/vector-icons/Entypo';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

type InputProps = {
  placeholder?: string;
  title?: string;
  className?: string;
  required?: boolean;
  secureTextEntry?: boolean;
  isPassword?: boolean;
  inputeStyle?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  type?: any;
  multiline?: boolean;
};

const Inpute = ({
  placeholder,
  title,
  className,
  required,
  secureTextEntry = false,
  isPassword = false,
  inputeStyle,
  value,
  onChangeText,
  type,
  multiline = false,
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const { mode } = useThemeStore();
  const isLight = mode === 'light';

  return (
    <View className={className}>
      {title && (
        <Text className='text-sm text-black dark:text-white/80 mb-1.5'>
          {title}
          {required && <Text className='text-red-600'>*</Text>}
        </Text>
      )}

      <View
        className={`flex-row items-center bg-[#151516] dark:bg-[#FFFFFF0D] rounded-xl ${inputeStyle}`}
      >
        <TextInput
          keyboardType={type}
          className='flex-1 p-4 text-white '
          placeholder={placeholder}
          placeholderTextColor={isLight ? 'white' : '#9CA3AF'}
          secureTextEntry={isPassword ? !showPassword : secureTextEntry}
          value={value}
          onChangeText={onChangeText}
          multiline={multiline}
        />

        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            className='p-2'
          >
            <Entypo
              name={showPassword ? 'eye-with-line' : 'eye'}
              size={20}
              color='#9CA3AF'
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default Inpute;
