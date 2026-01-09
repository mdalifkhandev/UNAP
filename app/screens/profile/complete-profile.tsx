import api from '@/api/axiosInstance';
import ShadowButton from '@/components/button/ShadowButton';
import Input from '@/components/inpute/Inpute';
import GradientBackground from '@/components/main/GradientBackground';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CompleteProfile = () => {
  const [roleOpen, setRoleOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState('Singer');

  const roles = ['Singer', 'Dancer', 'Actor', 'Model', 'Photographer'];

  // form state
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [instagram, setInstagram] = useState('');
  const [youtube, setYoutube] = useState('');
  const [spotify, setSpotify] = useState('');

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Helper function to format URLs properly
  const formatUrl = (url: string, platform?: string) => {
    if (!url || url.trim() === '') return '';
    const trimmed = url.trim();

    // If it already starts with http:// or https://, return as is
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed;
    }

    // Handle @ prefix (remove it before adding domain)
    const cleanUrl = trimmed.startsWith('@') ? trimmed.slice(1) : trimmed;

    // If it's just a username without domain, add the platform domain
    if (platform === 'instagram' && !cleanUrl.includes('.')) {
      return `https://instagram.com/${cleanUrl}`;
    }
    if (platform === 'youtube' && !cleanUrl.includes('.')) {
      return `https://youtube.com/@${cleanUrl}`;
    }
    if (platform === 'spotify' && !cleanUrl.includes('.')) {
      return `https://open.spotify.com/artist/${cleanUrl}`;
    }

    // Otherwise, add https://
    return `https://${cleanUrl}`;
  };

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.status !== 'granted') {
      setErrorMsg('Permission to access media library is required.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setProfileImage(uri);
      setErrorMsg(null);
    }
  };

  const handleCompleteProfile = async () => {
    if (!profileImage) {
      setErrorMsg('Profile image is required.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const formData = new FormData();

      // profileImage (required)
      const filename = profileImage.split('/').pop() || 'profile.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const ext = match?.[1]?.toLowerCase() || 'jpg';
      const mimeType =
        ext === 'png'
          ? 'image/png'
          : ext === 'jpeg' || ext === 'jpg'
            ? 'image/jpeg'
            : 'image/*';

      formData.append('profileImage', {
        uri: profileImage,
        name: filename,
        type: mimeType,
      } as any);

      // other fields (match your Postman body)
      formData.append('username', username);
      formData.append('role', selectedRole.toLowerCase());
      formData.append('bio', bio);
      formData.append('displayName', displayName);

      // Fixed: Format URLs properly with https://
      formData.append('instagramUrl', formatUrl(instagram, 'instagram'));
      formData.append('youtubeUrl', formatUrl(youtube, 'youtube'));
      formData.append('spotifyArtistUrl', formatUrl(spotify, 'spotify'));

      // optional socials if not used
      formData.append('tiktokUrl', '');
      formData.append('facebookUrl', '');

      const { data } = await api.post('/api/profile/complete', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(data);
      // success → go to home
      router.push('/(tabs)/profile');
    } catch (error: any) {
      // Check if profile is already completed
      const errorResponse = error?.response?.data;
      if (errorResponse?.error === 'Profile already completed.') {
        // Redirect to home if profile is already completed
        router.push('/(tabs)/profile');
        return;
      }

      // Show other errors
      setErrorMsg(
        errorResponse?.error ||
          error?.message ||
          'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <GradientBackground>
      <SafeAreaView className='flex-1' edges={['top', 'left', 'right']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            {/* headers */}
            <View className='mx-6 mt-10'>
              <Text className='font-roboto-bold text-primary text-2xl text-center flex-1'>
                Complete Your Profile
              </Text>
              <Text className='font-roboto-regular text-secondary text-center flex-1'>
                Let other artists know more about you
              </Text>
            </View>

            {/* profile image */}
            <View className='items-center mt-6'>
              <View className='relative'>
                <TouchableOpacity onPress={pickImage}>
                  <Image
                    source={
                      profileImage
                        ? { uri: profileImage }
                        : {
                            uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAACUCAMAAAAj+tKkAAAAPFBMVEWmpqb////y8vKjo6P19fWgoKD4+Pju7u6dnZ29vb2rq6vX19f7+/vl5eXp6enMzMyxsbHExMTd3d23t7e5IxatAAAHaUlEQVR4nMWc6bakKgyFLQEHcEB9/3dtsI5VDqDZDNX7z71r9Tr4VRgSIKF4Ravj9TCP0yKLgjEhGCukXqZxHuqyi2+9iIQb1NRq1hgsVuxkSRum20kNkZARgB2fjdVOZEet/9jOPAIyFLDrx8XYzc+2oxSNHvtQxjDAblwKGt3GWCxjGGIAYNUb29HhNolmGaofAHZqQWx3tOOiYDOCgJ2Sd5PiEZFJFBECrJQM6NujhFRQRyOAvY4w3s6Mus8CWOomBZ5Vo8v0gGORxHxvsYK86BAB6zS9u0PUQ0rAMWbqegjFmAyQt9Fz1yXR8jSAfXrzvcUYYTo/A6pcfBZRxQO2+fAsYRsJWLXJFj+3mvbBrzwALlntZ8WWCMBKZuczhPLWhneAPPXq7CHUd8vNHeAv7LcSyiDA6jf2Wwm1v5f9gHncm0/Cux76AMcf2s+K+UIHD+D8U/tZiRkBLDP7D5cad5TtBKx+OUE2scU5lZ2AU0gH23MYuer+vMYrMVEBZ7yDmWDLqOZ+MOpnNS4sYJA0rmHoACwljMe0qktuVBqt/62Vxs0oHcPQAYhGgKxo+2pF24tXfYtuBJmjk6+APTgAm6XnF7y3JfsF7Ghx3QNcAbFfzaSqXHRvVQoMONgzIOZCzPbWab2PFQcs5Lg6lDNgDc0Q1ta3fIawxoa0rB8AoSWQTTfd+0GEmrxEDSdAyMeJ9hnPEkKB0dnjnQARH8dofEZIL583okfAAfipRUHl4yW0IA43gBPyU+eH+bEjnJF2Jz9gDQwWNpH57EQBCEXtBRwRwKcF5gBYI4CTD7BDWhkJK8xXFfTbOw+gQoZyjfCVZQ00fTjz2gF2wGoAjUArZBSytnMCImuM7FHAHmh9v9LsAJFhojE8K01vXSgnIPALSU74qArp48IFiLjhhr5Ib+LITmfnkL+ASA83KJ71dwDg7oriC7jQ/74QcA+bPkZimuUKCO3lNNzDBhCJ/r9x6wcQ8udLACCHjivmCyDki9oQQCQq/A7CDbDDQtXcgGzpToCc/se/ACwKfgKskc3ID8ZgU58AFbSb0yHLDODrdt5uA0RC3h+sg9/AfwPEDgAaMBq0ggaR6aQTIPLH+X2x1RGQY2c8Im80Y8X4ARCJyK3yxoMrYH0A7NHTULSP+Qx+YEsX+AOE9ktF5j3J+wtzFGDWXd2qbSH8A4RvvnLui1dtR5mhgBlPFpyA6AixoxCxYED7sYDZTre25qdYwEKURELTwf8FkC1UC4bcTSYAJJ4Bc+gEOCmgccnuO6YDH3bK7wMMzAAwNny6JwmYwO+mY9fBt4S8Xw75EJo3fALEXd3WjlTXm84PHnxXt2v46OoCFqpNQvtvO3V4bsYJEA639k2x1oFY8b6NSlo/hltwsHFsrNCqrv5u3Lm9cq9qpSPzmo8BKxjyXyUauc9ZkCH1EkdVB0Bw0+RmFDbtQ0vJRIq0oNcRENwxZNdl2xm4nGbTZeMOHX38QJejD2zf7xULSzq66nJ4BB2/ucBE0zRMaqOCmf8NLSv66Hz8Bh1gnuEKqVvVv3OOVtW9mrTN4Qpu83KACR0B72UL0uaBVwdfYpdqXs9hKVxrq5cj4DBvzIRUQ+kLCk0UMSgZ1NnseoiOp5SZSGZyJG2dIoZumAIiLsc1BHSRYyXE6AljLkHNCLsWx0UOmhNVjNRNnY0fwIoo51UYmNPTY0cffWh2z/7ik/wjGZvp5tuMONMXHfd1LH2hed4quRHJ/n5fj7VPCaD9PRMjZW44CDm1uIy5UwJoSRUMTlf4qupJeyhfUgVpa8c0cux2ISQVEPrSUiiJPWyJ4bPnSASf703sec5uZEvY8NsR8uXpI8eSRSi5zNgvDs/q0Ias9AI+BP6x/ftnw4dxeJeed598xB7OYeiE93P5LsHxPgsdv6DzEN5d6pyrh+hJtkIl4jOrzU09zUOSrb+USbQBd8RewpvPvO4BfYneZoFOx2emsm+iPCZ6+0IG4NKBIt/FxHOqvKfYgKXsYKvKPR0JxQaeco20eGtutUOkcg3Xas3GpB28Ejq2GK5yaFrJUNoZ8lZ9PVAjlgxdi65EegO6bmipRVfXqCYkTYZAeP4KuWztXPgHXl5TxY8mRAr/zh7vviwoWMfQBCmdPBaf0utGUO3XQgYVnx7PGdJFCUfx3SbI+/IHpQA6wxrz1vd2Bi+A/lYPJfdyX338XUgJ+acIv8nVw7aP35Px7iGD52cMRLYeNsH/Oo4CnzH4ewiCnpkQovULwQ9BrE9pZIgTvrLpAhFPabzWmZI2Uj0BzizqMRL7nEuivaYHsC8in3N5vfLN4VWPLzM9PynU5eR7fn2L8ChTRkLC62Ckd7dy+WLKt2kPg+UJWEmfJj6t1qXfNNE+TH+cLvW+mPpdMqAJs9OJaj4MMFk/Q8+yIoCJ+hl7ShQDTICIvnSKAhrEiI7m+EOsOGC4awl6EjgE8BVixgDjxQAaMyKMvAp+TzkY0IrGGGq7BIAva8g7Sh5hukSAf5i2w7+gfCVL8N640T+bRXIenAc+TwAAAABJRU5ErkJggg==',
                          }
                    }
                    style={{ width: 100, height: 100, borderRadius: 100 }}
                    contentFit='cover'
                  />
                </TouchableOpacity>
              </View>
            </View>
            <Text className='text-primary text-xl font-roboto-semibold text-center mt-3'>
              Upload Photo
            </Text>

            {/* input fields */}
            <View className='mx-6 mt-6'>
              {/* Username */}
              <Text className='text-primary'>Username</Text>
              <Input
                className='mt-2'
                placeholder='@yourhandle'
                value={username}
                onChangeText={setUsername}
              />

              {/* Display Name */}
              <Text className='text-primary mt-3'>Display Name</Text>
              <Input
                className='mt-2'
                placeholder='Rokey Mahmud'
                value={displayName}
                onChangeText={setDisplayName}
              />

              {/* Select Your Role */}
              <Text className='text-primary mb-2 mt-3 text-base'>
                Select Your Role
              </Text>

              <View className='w-full'>
                <TouchableOpacity
                  onPress={() => setRoleOpen(!roleOpen)}
                  className='w-full bg-primary/5 border border-gray-700 rounded-xl p-4 flex-row justify-between items-center'
                >
                  <Text className='text-gray-200 text-base'>
                    {selectedRole}
                  </Text>
                  <Feather
                    name={roleOpen ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color='#fff'
                  />
                </TouchableOpacity>

                {roleOpen && (
                  <View className='mt-1 bg-[#121212] rounded-xl border border-gray-700'>
                    {roles.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          setSelectedRole(item);
                          setRoleOpen(false);
                        }}
                        className='p-4 border-b border-gray-800'
                      >
                        <Text className='text-gray-200'>{item}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Bio */}
              <Text className='text-primary mt-3 mb-2 text-base'>Bio</Text>
              <TextInput
                placeholder='Tell us about yourself and your music...'
                placeholderTextColor='#ffffff98'
                multiline
                numberOfLines={4}
                className='bg-primary/5 border border-[#FFFFFF30] rounded-xl p-4 text-primary'
                style={{ textAlignVertical: 'top' }}
                value={bio}
                onChangeText={setBio}
              />

              {/* Instagram */}
              <Text className='text-primary mt-3'>Instagram</Text>
              <View className='rounded-xl px-4 py-1 flex-row items-center border border-[#FFFFFF1A] bg-[#FFFFFF0D] mt-1.5 gap-2'>
                <AntDesign name='instagram' size={20} color='#fff' />
                <TextInput
                  placeholder='@username'
                  placeholderTextColor='white'
                  className='flex-1 text-primary'
                  value={instagram}
                  onChangeText={setInstagram}
                />
              </View>

              {/* YouTube */}
              <Text className='text-primary mt-3'>YouTube</Text>
              <View className='rounded-xl px-4 py-1 flex-row items-center border border-[#FFFFFF1A] bg-[#FFFFFF0D] mt-1.5 gap-2'>
                <AntDesign name='youtube' size={20} color='white' />
                <TextInput
                  placeholder='Channel URL'
                  placeholderTextColor='white'
                  className='flex-1 text-primary'
                  value={youtube}
                  onChangeText={setYoutube}
                />
              </View>

              {/* Spotify */}
              <Text className='text-primary mt-3'>Spotify</Text>
              <View className='rounded-xl px-4 py-1 flex-row items-center border border-[#FFFFFF1A] bg-[#FFFFFF0D] mt-1.5 gap-2'>
                <Feather name='music' size={20} color='white' />
                <TextInput
                  placeholder='Artist URL'
                  placeholderTextColor='white'
                  className='flex-1 text-primary'
                  value={spotify}
                  onChangeText={setSpotify}
                />
              </View>
            </View>

            <View className='pb-8'>
              {errorMsg ? (
                <Text className='text-red-400 text-center mt-4 mx-6'>
                  {errorMsg}
                </Text>
              ) : null}

              <ShadowButton
                text={loading ? 'Saving...' : 'Complete Setup'}
                textColor='#2B2B2B'
                backGroundColor='#E8EBEE'
                onPress={handleCompleteProfile}
                className='mt-8 mx-6'
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default CompleteProfile;
