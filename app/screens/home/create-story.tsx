import ShadowButton from '@/components/button/ShadowButton';
import GradientBackground from '@/components/main/GradientBackground';
import useThemeStore from '@/store/theme.store';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

const { width } = Dimensions.get('window');

const CreateStory = () => {
  const { mode } = useThemeStore();
  const isLight = mode === 'light';
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Toast.show({
        type: 'error',
        text1: 'Permission Required',
        text2: 'Camera roll permissions are needed to select a UCuts.',
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [9, 16],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handlePostStory = () => {
    // Mock functionality for now
    if (!selectedImage) return;

    Toast.show({
      type: 'success',
      text1: 'UCuts Created',
      text2: 'Your UCuts has been shared successfully!',
    });

    // Simulate API call delay
    setTimeout(() => {
      router.back();
    }, 1500);
  };

  return (
    <GradientBackground>
      <SafeAreaView className='flex-1'>
        <View className='flex-row items-center justify-between px-4 py-2.5'>
          <TouchableOpacity
            onPress={() => router.back()}
            className='p-1.5'
          >
            <Ionicons
              name='close'
              size={28}
              color={isLight ? 'black' : 'white'}
            />
          </TouchableOpacity>
          <Text className='text-black dark:text-white text-lg font-semibold'>
            Create UCuts
          </Text>
          <View className='w-10' />
        </View>

        <View className='flex-1 items-center justify-center p-5'>
          {selectedImage ? (
            <View className='w-full h-full overflow-hidden items-center justify-center'>
              <Image
                source={{ uri: selectedImage }}
                style={{ width: '100%', height: '100%' }}
                contentFit='cover'
              />
              <TouchableOpacity
                onPress={() => setSelectedImage(null)}
                className='absolute top-5 right-5 bg-black/50 p-2.5 rounded-full'
              >
                <Ionicons
                  name='trash-outline'
                  size={24}
                  color={isLight ? 'black' : 'white'}
                />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={pickImage}
              className='items-center justify-center border-2 border-black/20 dark:border-white/10 border-dashed rounded-2xl bg-[#F0F2F5] dark:bg-[#FFFFFF0D]'
              style={{ width: width * 0.8, height: width * 0.8 * 1.77 }}
            >
              <View className='w-20 h-20 rounded-full bg-[#F0F2F5] dark:bg-[#FFFFFF0D] items-center justify-center mb-4'>
                <Ionicons
                  name='image-outline'
                  size={40}
                  color={isLight ? 'black' : 'white'}
                />
              </View>
              <Text className='text-black/50 dark:text-white/70 text-base'>
                Tap to select a photo
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {selectedImage && (
          <View className='px-6 pb-10'>
            <ShadowButton
              text='Share to UCuts'
              textColor='#2B2B2B'
              backGroundColor='#E8EBEE'
              onPress={handlePostStory}
              className='w-full'
            />
          </View>
        )}
      </SafeAreaView>
    </GradientBackground>
  );
};

export default CreateStory;
