import BackButton from '@/components/button/BackButton';
import GradientBackground from '@/components/main/GradientBackground';
import { useGetSupportMessages, useGetSupportThreads, useSendSupportMessage } from '@/hooks/app/support';
import { useTranslateTexts } from '@/hooks/app/translate';
import useLanguageStore from '@/store/language.store';
import useThemeStore from '@/store/theme.store';
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

const ContactSupport = () => {
  const { language } = useLanguageStore();
  const { mode } = useThemeStore();
  const isLight = mode === 'light';
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');

  const { data: t } = useTranslateTexts({
    texts: [
      'Contact Admin',
      'Subject',
      'Message',
      'Type subject...',
      'Write your message...',
      'Send Message',
      'Previous Messages',
      'No previous messages.',
      'Admin Support',
    ],
    targetLang: language,
    enabled: !!language && language !== 'EN',
  });
  const tx = (i: number, fallback: string) => t?.translations?.[i] || fallback;

  const { data: threadsData } = useGetSupportThreads(20);
  const threads = threadsData?.threads || [];
  const latestThread = threads[0];
  const threadId = latestThread?._id || latestThread?.id;
  const { data: messagesData } = useGetSupportMessages(threadId, 100);
  const messages = useMemo(
    () => (messagesData?.messages || []).slice().sort((a: any, b: any) => {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }),
    [messagesData?.messages]
  );

  const { mutate: sendSupportMessage, isPending: isSending } = useSendSupportMessage();

  const handleSend = () => {
    const normalizedSubject = subject.trim();
    const normalizedContent = content.trim();
    if (!normalizedSubject || !normalizedContent) return;

    sendSupportMessage(
      { subject: normalizedSubject, content: normalizedContent },
      {
        onSuccess: () => {
          setContent('');
        },
      }
    );
  };

  return (
    <GradientBackground>
      <SafeAreaView className='flex-1 mt-2.5' edges={['top', 'left', 'right']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <View className='flex-row mt-4 mx-6'>
            <BackButton />
            <Text className='text-primary dark:text-white font-roboto-bold text-2xl text-center flex-1'>
              {tx(0, 'Contact Admin')}
            </Text>
          </View>
          <View className='border-b border-black/20 dark:border-[#FFFFFF0D] w-full mt-2'></View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 36, marginHorizontal: 24 }}
          >
            <View className='bg-[#F0F2F5] dark:bg-[#FFFFFF0D] rounded-2xl p-4 mt-6 border border-black/20 dark:border-[#FFFFFF0D]'>
              <Text className='text-primary dark:text-white font-roboto-semibold mb-2'>
                {tx(1, 'Subject')}
              </Text>
              <TextInput
                value={subject}
                onChangeText={setSubject}
                placeholder={tx(3, 'Type subject...')}
                placeholderTextColor={isLight ? '#6B7280' : 'rgba(255,255,255,0.6)'}
                className='bg-white dark:bg-[#0F141B] text-primary dark:text-white rounded-xl px-3 py-3 border border-black/20 dark:border-[#FFFFFF0D]'
              />

              <Text className='text-primary dark:text-white font-roboto-semibold mt-4 mb-2'>
                {tx(2, 'Message')}
              </Text>
              <TextInput
                value={content}
                onChangeText={setContent}
                multiline
                textAlignVertical='top'
                placeholder={tx(4, 'Write your message...')}
                placeholderTextColor={isLight ? '#6B7280' : 'rgba(255,255,255,0.6)'}
                className='bg-white dark:bg-[#0F141B] text-primary dark:text-white rounded-xl px-3 py-3 border border-black/20 dark:border-[#FFFFFF0D] min-h-[120px]'
              />

              <TouchableOpacity
                onPress={handleSend}
                disabled={isSending || !subject.trim() || !content.trim()}
                className='mt-4 py-3 rounded-xl bg-black dark:bg-white'
              >
                <Text className='text-center text-white dark:text-black font-roboto-semibold'>
                  {isSending ? 'Sending...' : tx(5, 'Send Message')}
                </Text>
              </TouchableOpacity>
            </View>

            <View className='mt-6'>
              <Text className='text-primary dark:text-white font-roboto-semibold text-lg mb-3'>
                {tx(6, 'Previous Messages')}
              </Text>

              {messages.length === 0 ? (
                <View className='bg-[#F0F2F5] dark:bg-[#FFFFFF0D] rounded-xl p-4 border border-black/20 dark:border-[#FFFFFF0D]'>
                  <Text className='text-secondary dark:text-white/80'>
                    {tx(7, 'No previous messages.')}
                  </Text>
                </View>
              ) : (
                messages.map((msg: any) => (
                  <View
                    key={msg._id}
                    className='bg-[#F0F2F5] dark:bg-[#FFFFFF0D] rounded-xl p-4 border border-black/20 dark:border-[#FFFFFF0D] mb-3'
                  >
                    <Text className='text-primary dark:text-white font-roboto-semibold'>
                      {msg.subject || tx(8, 'Admin Support')}
                    </Text>
                    <Text className='text-primary dark:text-white/90 mt-2'>
                      {msg.content}
                    </Text>
                    <Text className='text-secondary dark:text-white/70 text-xs mt-3'>
                      {new Date(msg.createdAt).toLocaleString()}
                    </Text>
                  </View>
                ))
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default ContactSupport;

