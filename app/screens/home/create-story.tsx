import ShadowButton from '@/components/button/ShadowButton';
import GradientBackground from '@/components/main/GradientBackground';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

const { width } = Dimensions.get('window');

const CreateStory = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Toast.show({
        type: 'error',
        text1: 'Permission Required',
        text2: 'Camera roll permissions are needed to select a story.',
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
      text1: 'Story Created',
      text2: 'Your story has been shared successfully!',
    });

    // Simulate API call delay
    setTimeout(() => {
        router.back();
    }, 1500);
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
            <Ionicons name="close" size={28} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Story</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.content}>
          {selectedImage ? (
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: selectedImage }}
                style={styles.previewImage}
                contentFit="cover"
              />
              <TouchableOpacity
                onPress={() => setSelectedImage(null)}
                style={styles.removeButton}
              >
                <Ionicons name="trash-outline" size={24} color="white" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={pickImage} style={styles.placeholderContainer}>
              <View style={styles.iconCircle}>
                <Ionicons name="image-outline" size={40} color="white" />
              </View>
              <Text style={styles.placeholderText}>Tap to select a photo</Text>
            </TouchableOpacity>
          )}
        </View>

        {selectedImage && (
          <View style={styles.footer}>
             <ShadowButton
                text="Share to Story"
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  closeButton: {
    padding: 5,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  placeholderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.8,
    height: width * 0.8 * 1.77, // 16:9 aspect ratioish
    borderWidth: 2,
    borderColor: '#FFFFFF30',
    borderStyle: 'dashed',
    borderRadius: 20,
    backgroundColor: '#FFFFFF0D',
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF1A',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  placeholderText: {
    color: '#FFFFFF80',
    fontSize: 16,
  },
  imageContainer: {
    width: width,
    height: '100%',
    borderRadius: 0,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center'
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 0,
  },
  removeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 25,
  },
  footer: {
    padding: 24,
    paddingBottom: 40,
  },
});

export default CreateStory;
