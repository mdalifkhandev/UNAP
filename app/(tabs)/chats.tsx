import GradientBackground from '@/components/main/GradientBackground';
import { useGetAllChatList } from '@/hooks/app/chat';
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

const formatMessageTime = (createdAt: string) => {
  const messageDate = new Date(createdAt);
  const today = new Date();
  const isToday = messageDate.toDateString() === today.toDateString();

  if (isToday) {
    return messageDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } else {
    return messageDate.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }
};

const ChatsList = () => {
  const { data, isLoading, isError, error } = useGetAllChatList();

  console.log(
    JSON.stringify(data,null,2)
  );


// @ts-ignore
  const chatData = data?.chats ?? [];

  const [searchQuery, setSearchQuery] = useState('');

  // Filter chats based on search query
  const filteredChats = useMemo(() => {
    if (!searchQuery.trim()) {
      return chatData;
    }

    const query = searchQuery.toLowerCase();
    return chatData.filter((chat: any) =>
      chat?.name.toLowerCase().includes(query)
    );
  }, [searchQuery, chatData]);

  if (isLoading) {
    return <Text className='text-white text-center mt-10'>Loading...</Text>;
  }

  if (isError) {
    return (
      <View className='flex-1 justify-center items-center'>
        <Text className='text-red-500 text-center mt-10'>
          Failed to load chats
        </Text>
        <Text className='text-white text-center mt-2'>
          {error?.message || 'Unknown error'}
        </Text>
      </View>
    );
  }
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
              {filteredChats.map((chat: any, index: number) => (
                <View key={index}>
                  <TouchableOpacity
                    onPress={() =>
                      router.push({
                        pathname: '/screens/chat/chat-screen',
                        params: {
                          userId: chat?.userId,
                          userName: chat?.name,
                          userImage: chat?.profileImageUrl || null,
                          conversationId: chat?.conversationId,
                          senderId: chat?.lastMessage?.senderId,
                          receiverId: chat?.userId,
                        },
                      })
                    }
                    className='flex-row justify-between  my-3'
                  >
                    <View className='w-[70%] flex-row gap-2 items-center'>
                      {chat?.unreadCount !== 0 && (
                        <View className=' bg-[#007AFF] h-2 w-2 rounded-full' />
                      )}
                      <TouchableOpacity
                        onPress={() => router.push('/(tabs)/profile')}
                        className='mt-2'
                      >
                        <Image
                          source={
                            chat?.profileImageUrl
                              ? { uri: chat?.profileImageUrl }
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
                          {chat?.name}
                        </Text>
                        <Text
                          className='text-secondary font-roboto-regular mt-1'
                          numberOfLines={1}
                        >
                          {chat?.lastMessage?.text}
                        </Text>
                      </View>
                    </View>
                        {chat?.lastMessage?.text}
                    <View className='flex-1 items-end'>
                      <Text
                        className='text-secondary text-center'
                        numberOfLines={1}
                      >
                        {chat?.lastMessage?.createdAt ? formatMessageTime(chat.lastMessage.createdAt) : ''}

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
