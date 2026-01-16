import BackButton from '@/components/button/BackButton';
import GradientBackground from '@/components/main/GradientBackground';
import ChatSettings from '@/components/modal/ChatSettings';
import { useGetAllMessages } from '@/hooks/app/chat';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
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

/**
 * ✅ Logged-in user id
 * (Later this will come from auth)
 */
const CURRENT_USER_ID = 'me';

/**
 * ✅ Dummy messages with senderId
 */
// const dummyMessages = {
//   'Arif Hasan dwadadaw': [
//     {
//       id: '1',
//       senderId: 'Arif Hasan dwadadaw',
//       text: 'Hey! Are you coming today?',
//       time: '09:10 AM',
//     },
//     {
//       id: '2',
//       senderId: 'me',
//       text: "Yes! I'll be there in 30 minutes.",
//       time: '09:12 AM',
//     },
//     {
//       id: '3',
//       senderId: 'Arif Hasan dwadadaw',
//       text: "Great! Don't forget to bring the documents.",
//       time: '09:15 AM',
//     },
//   ],
//   'Nusrat Jahan': [
//     {
//       id: '1',
//       senderId: 'Nusrat Jahan',
//       text: 'I have sent the documents.',
//       time: '08:50 AM',
//     },
//     {
//       id: '2',
//       senderId: 'me',
//       text: "Thanks! I'll check them now.",
//       time: '08:55 AM',
//     },
//     {
//       id: '3',
//       senderId: 'Nusrat Jahan',
//       text: 'Let me know if you need any changes.',
//       time: '09:00 AM',
//     },
//   ],
//   default: [
//     {
//       id: '1',
//       senderId: 'other',
//       text: 'Hi! How are you doing today?',
//       time: '09:10 AM',
//     },
//     {
//       id: '2',
//       senderId: 'me',
//       text: "Hey! I'm good, thanks for asking.",
//       time: '09:12 AM',
//     },
//   ],
// };

const ChatScreen = () => {
  const flatRef = useRef<FlatList>(null);
  const params = useLocalSearchParams();
  const [showMenu, setShowMenu] = useState(false);

  const userName = (params.userName as string) || 'Unknown User';
  const userImage = params.userImage as string | undefined;
  const userId = params.userId as string;
  const conversationId = params.conversationId as string;
  const senderId = params.senderId as string;
  const receiverId = params.receiverId as string;

  const {data, isLoading, isError, error} = useGetAllMessages(userId);

  console.log('Messages data:', JSON.stringify(data?.messages, null, 2));

  const messages = data?.messages || [];

  console.log('Chat screen params:', {
    userName,
    userId,
    conversationId,
    senderId,
    receiverId
  });

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
                <Text className='text-secondary font-roboto-regular mt-1'>
                  Online
                </Text>
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
            keyExtractor={item => item._id}
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
                className='flex-1 text-white text-[15px] border border-[#5E5E5E] rounded-[10px] px-3'
              />
            </View>

            <TouchableOpacity className='bg-[#ffffff0d] h-12 w-12 rounded-full items-center justify-center border border-[#ffffff1a]'>
              <Feather name='send' size={24} color='white' />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>

        <ChatSettings showMenu={showMenu} setShowMenu={setShowMenu} />
      </SafeAreaView>
    </GradientBackground>
  );
};

export default ChatScreen;
