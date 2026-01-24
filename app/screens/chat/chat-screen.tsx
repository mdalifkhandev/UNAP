import BackButton from '@/components/button/BackButton';
import GradientBackground from '@/components/main/GradientBackground';
import ChatSettings from '@/components/modal/ChatSettings';
import { useChattingSendMessage, useGetAllMessages, useMarkMessagesAsRead } from '@/hooks/app/chat';
import { useSocketChat } from '@/hooks/app/useSocketChat';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import { useQueryClient } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';



const ChatScreen = () => {
  const flatRef = useRef<FlatList>(null);
  const params = useLocalSearchParams();
  const [showMenu, setShowMenu] = useState(false);
  const [message, setMessage] = useState('');
  const queryClient = useQueryClient();

  const userName = (params.userName as string) || 'Unknown User';
  const userImage = params.userImage as string | undefined;
  const userId = params.userId as string;
  const conversationId = params.conversationId as string;
  const senderId = params.senderId as string;
  const receiverId = params.receiverId as string;

  const {data, isLoading, isError, error} = useGetAllMessages(userId);
  const {mutateAsync:sendMessage,isPending:isSendingMessage}=useChattingSendMessage()
  const {mutate:markAsRead}=useMarkMessagesAsRead()
  const {isConnected, sendMessage: sendSocketMessage} = useSocketChat(userId, conversationId);



  // @ts-ignore
  const messages = data?.messages || [];

  const handleSendMessage = async () => {
  if (!message.trim()) return;

  const tempMessage = {
    _id: `temp-${Date.now()}`,
    senderId: senderId,
    text: message.trim(),
    createdAt: new Date().toISOString(),
    isTemp: true // Mark as temporary
  };

  try {
    // Add temporary message immediately for better UX
    if (isConnected) {
      // Use socket for real-time messaging
      await sendSocketMessage(receiverId, message);
    } else {
      // Fallback to REST API
      await sendMessage({
        data: { text: message },
        userId: receiverId
      });
    }
    setMessage(''); // Clear input after sending
  } catch (error) {
    console.error('Failed to send message:', error);
    // Remove temporary message on error
    queryClient.setQueryData(['chat', userId], (oldData: any) => {
      if (!oldData?.messages) return oldData;
      return {
        ...oldData,
        messages: oldData.messages.filter((msg: any) => msg._id !== tempMessage._id)
      };
    });
  }
};

  useEffect(() => {
    // Mark messages as read when chat screen opens
    if (userId) {
      markAsRead(userId);
    }
  }, [userId, markAsRead]);

  useEffect(() => {
    setTimeout(() => {
      flatRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);




  const renderMessage = ({ item }: any) => {
    const isCurrentUser = item.senderId === senderId;

    /** ================= RIGHT SIDE (ME) ================= */
    if (isCurrentUser) {
      return (
        <View className='flex-row justify-end mb-4 px-4 mt-8'>
          <View className='bg-[#FFFFFF0D] border border-[#FFFFFF0D] rounded-[10px] w-[75%] py-2.5 px-3'>
            <Text className='font-roboto-semibold text-primary'>
              {item.text}
            </Text>
            <Text className='text-sm font-roboto-regular text-primary mt-3'>
              {new Date(item.createdAt).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              })}
            </Text>
          </View>
        </View>
      );
    }

    /** ================= LEFT SIDE (OTHER USER) ================= */
    return (
      <View className='flex-row gap-3 items-end mt-7 px-4'>
        <TouchableOpacity className='mt-2 relative'>
          <Image
            source={
              userImage
                ? { uri: userImage }
                : require('@/assets/images/profile.png')
            }
            style={{ width: 40, height: 40, borderRadius: 100 }}
            contentFit='cover'
          />
          <View className='h-3 w-3 rounded-full bg-[#00B56C] absolute right-0 bottom-0' />
        </TouchableOpacity>

        <View className='bg-primary border border-[#EEEEEE] rounded-[10px] w-[75%] py-2.5 px-3'>
          <Text className='font-roboto-semibold text-[#434343]'>
            {item.text}
          </Text>
          <Text className='text-sm font-roboto-regular text-[#434343] mt-3'>
            {new Date(item.createdAt).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            })}
          </Text>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <GradientBackground>
        <SafeAreaView className='flex-1 items-center justify-center'>
          <Text className='text-white'>Loading messages...</Text>
        </SafeAreaView>
      </GradientBackground>
    );
  }

  if (isError) {
    return (
      <GradientBackground>
        <SafeAreaView className='flex-1 items-center justify-center'>
          <Text className='text-red-500'>Failed to load messages</Text>
          <Text className='text-white mt-2'>{error?.message || 'Unknown error'}</Text>
        </SafeAreaView>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <SafeAreaView className='flex-1' edges={['top', 'left', 'right']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          {/* Header */}
          <View className='flex-row justify-between items-center mx-6 mt-5 mb-2'>
            <View className='flex-row items-center gap-5'>
              <BackButton />
              <TouchableOpacity className='mt-2 relative'>
                <Image
                  source={
                    userImage
                      ? { uri: userImage }
                      : require('@/assets/images/profile.png')
                  }
                  style={{ width: 46, height: 46, borderRadius: 100 }}
                  contentFit='cover'
                />
                <View className='h-3 w-3 rounded-full bg-[#00B56C] absolute right-0 bottom-0' />
              </TouchableOpacity>
              <View>
                <Text className='text-primary font-roboto-semibold text-xl'>
                  {userName}
                </Text>
                <View className='flex-row items-center gap-2'>
                  <View className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                  <Text className='text-xs text-secondary'>
                    {isConnected ? 'Online' : 'Offline'}
                  </Text>
                </View>
              </View>
            </View>
            <TouchableOpacity onPress={() => setShowMenu(true)}>
              <Entypo name='dots-three-horizontal' size={24} color='white' />
            </TouchableOpacity>
          </View>

          {/* Messages */}
          <FlatList
            ref={flatRef}
            data={messages}
            keyExtractor={(item, index) => `${item._id || item.id || `message-${index}`}`}
            renderItem={renderMessage}
            onContentSizeChange={() =>
              flatRef.current?.scrollToEnd({ animated: true })
            }
            showsVerticalScrollIndicator={false}
          />

          {/* Input */}
          <View className='flex-row items-center py-8 mx-6 gap-3'>
            <TouchableOpacity className='bg-[#ffffff0d] h-12 w-12 rounded-full items-center justify-center border border-[#ffffff1a]'>
              <Feather name='plus' size={25} color='white' />
            </TouchableOpacity>

            <View className='flex-1 rounded-3xl flex-row items-center px-4 h-12'>
              <TextInput
                placeholder='Type a message...'
                placeholderTextColor='#9ca3af'
                multiline
                value={message}
                onChangeText={setMessage}
                className='flex-1 text-white text-[15px] border border-[#5E5E5E] rounded-[10px] px-3'
              />
            </View>

            <TouchableOpacity
              onPress={handleSendMessage}
              disabled={isSendingMessage || !message.trim()}
              className={`h-12 w-12 rounded-full items-center justify-center border ${
                isSendingMessage || !message.trim()
                  ? 'border-[#5E5E5E] bg-[#ffffff0a]'
                  : 'border-[#ffffff1a] bg-[#ffffff0d]'
              }`}
            >
              <Feather
                name='send'
                size={24}
                color={(isSendingMessage || !message.trim()) ? '#9ca3af' : 'white'}
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>

        <ChatSettings showMenu={showMenu} setShowMenu={setShowMenu} />
      </SafeAreaView>
    </GradientBackground>
  );
};

export default ChatScreen;
