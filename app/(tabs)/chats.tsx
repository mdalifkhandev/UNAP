import GradientBackground from '@/components/main/GradientBackground';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
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

const chatData = [
  {
    name: 'Arif Hasan dwadadaw',
    message: 'Hey! Are you coming today?',
    time: '09:12 AM',
    read: false,
  },
  {
    name: 'Nusrat Jahan',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    message: 'I have sent the documents.',
    time: '08:50 AM',
    read: false,
  },
  {
    name: 'Mehedi Hossain',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    message: 'Got it bro! Thanks! erfgegfegegretgregergerer',
    time: '08:12 AM',
    read: false,
  },
  {
    name: 'Tania Akter',
    image: 'https://randomuser.me/api/portraits/women/65.jpg',
    message: 'Let’s meet after lunch.',
    time: 'Yesterday',
  },
  {
    name: 'Sakib Rahman',
    image: 'https://randomuser.me/api/portraits/men/76.jpg',
    message: 'Can you review my code?',
    time: 'Yesterday',
  },
  {
    name: 'Maliha Chowdhury',
    image: 'https://randomuser.me/api/portraits/women/21.jpg',
    message: 'I reached home safely! ererfawefdwefwerfwerfwerfwerfwef',
    time: 'Monday',
  },
  {
    name: 'Farhan Khan',
    image: 'https://randomuser.me/api/portraits/men/89.jpg',
    message: "Call me when you're free.",
    time: 'Monday',
  },
  {
    name: 'Sadia Afreen',
    image: 'https://randomuser.me/api/portraits/women/17.jpg',
    message: 'We should plan the trip.',
    time: 'Sunday',
  },
  {
    name: 'Tanvir Ahmed',
    image: 'https://randomuser.me/api/portraits/men/56.jpg',
    message: 'Bro! Where are you?',
    time: 'Sunday',
  },
  {
    name: 'Sakib Rahman',
    image: 'https://randomuser.me/api/portraits/men/76.jpg',
    message: 'Can you review my code?',
    time: 'Yesterday',
  },
  {
    name: 'Maliha Chowdhury',
    image: 'https://randomuser.me/api/portraits/women/21.jpg',
    message: 'I reached home safely!',
    time: 'Monday',
  },
  {
    name: 'Farhan Khan',
    image: 'https://randomuser.me/api/portraits/men/89.jpg',
    message: "Call me when you're free.",
    time: 'Monday',
  },
  {
    name: 'Sadia Afreen',
    image: 'https://randomuser.me/api/portraits/women/17.jpg',
    message: 'We should plan the trip.',
    time: 'Sunday',
  },
  {
    name: 'Tanvir Ahmed',
    image: 'https://randomuser.me/api/portraits/men/56.jpg',
    message: 'Bro! Where are you?',
    time: 'Sunday',
  },
];

const ChatsList = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter chats based on search query
  const filteredChats = useMemo(() => {
    if (!searchQuery.trim()) {
      return chatData;
    }

    const query = searchQuery.toLowerCase();
    return chatData.filter(chat => chat.name.toLowerCase().includes(query));
  }, [searchQuery]);
  return (
    <GradientBackground>
      <SafeAreaView className='flex-1  ' edges={['top', 'left', 'right']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          {/* headers */}
          <View className='mt-3 flex-row items-center mx-6 justify-between'>
            <Text className='font-roboto-bold text-primary text-2xl text-center flex-1'>
              Chat
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/screens/home/notification')}
            >
              <Ionicons name='notifications-outline' size={24} color='white' />
            </TouchableOpacity>
          </View>

          {/* search bar */}
          <View className='mx-6 mt-7 h-12 flex-row items-center rounded-2xl bg-white px-4 shadow'>
            {/* Search Icon */}
            <Feather name='search' size={18} color='#475569' />

            {/* Input */}
            <TextInput
              placeholder='Search chats...'
              placeholderTextColor='#6B7280'
              returnKeyType='search'
              className='ml-2 flex-1 text-base text-black'
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* chat list  */}
            <View className='mx-6 mt-6'>
              {filteredChats.map((chat, index) => (
                <View key={index}>
                  <TouchableOpacity
                    onPress={() =>
                      router.push({
                        pathname: '/screens/chat/chat-screen',
                        params: {
                          userId: chat.name,
                          userName: chat.name,
                          userImage: chat.image || null,
                        },
                      })
                    }
                    className='flex-row justify-between  my-3'
                  >
                    <View className='w-[70%] flex-row gap-2 items-center'>
                      {chat.read === false && (
                        <View className=' bg-[#007AFF] h-2 w-2 rounded-full' />
                      )}
                      <TouchableOpacity
                        onPress={() => router.push('/(tabs)/profile')}
                        className='mt-2'
                      >
                        <Image
                          source={
                            chat.image
                              ? { uri: chat.image }
                              : require('@/assets/images/profile.png')
                          }
                          style={{
                            width: 46,
                            height: 46,
                            borderRadius: 100,
                          }}
                          contentFit='cover'
                        />
                      </TouchableOpacity>
                      <View className='w-5/6'>
                        <Text
                          className='text-primary font-roboto-semibold text-xl'
                          numberOfLines={1}
                        >
                          {chat.name}
                        </Text>
                        <Text
                          className='text-secondary font-roboto-regular mt-1'
                          numberOfLines={1}
                        >
                          {/* {chat.message} */}
                        </Text>
                      </View>
                    </View>

                    <View className='flex-1 items-end'>
                      <Text
                        className='text-secondary text-center'
                        numberOfLines={1}
                      >
                        {chat.time}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  {/* border */}
                  <View className='border-b border-[#E0E0E0] w-full'></View>
                </View>
              ))}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default ChatsList;
