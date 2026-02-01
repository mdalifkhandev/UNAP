import BackButton from '@/components/button/BackButton';
import GradientBackground from '@/components/main/GradientBackground';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

const FAQItem: React.FC<FAQItemProps> = ({
  question,
  answer,
  isOpen,
  onToggle,
}) => {
  const animatedHeight = useRef(new Animated.Value(isOpen ? 1 : 0)).current;
  const animatedRotation = useRef(new Animated.Value(isOpen ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(animatedHeight, {
        toValue: isOpen ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(animatedRotation, {
        toValue: isOpen ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isOpen]);

  const maxHeight = animatedHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 200],
  });

  const rotation = animatedRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View className='bg-[#F0F2F5] dark:bg-[#FFFFFF0D] rounded-2xl mb-3 overflow-hidden border border-black/20 dark:border-[#FFFFFF0D] dark:border-[#FFFFFF0D]'>
      <TouchableOpacity
        onPress={onToggle}
        activeOpacity={0.7}
        className='px-5 py-4 flex-row items-start justify-between'
      >
        <Text className='text-primary dark:text-white text-lg font-roboto-regular pr-4 flex-1'>
          {question}
        </Text>
        <Animated.View style={{ transform: [{ rotate: rotation }] }}>
          <Ionicons
            name='chevron-down'
            size={20}
            color='#9CA3AF'
            style={{ marginTop: 2 }}
          />
        </Animated.View>
      </TouchableOpacity>

      <Animated.View style={{ maxHeight, overflow: 'hidden' }}>
        <View className='px-5 pb-4'>
          <Text className='text-secondary dark:text-white/80 leading-relaxed'>{answer}</Text>
        </View>
      </Animated.View>
    </View>
  );
};

const Faq = () => {
  const [openIndex, setOpenIndex] = useState<number>(0);

  const faqData = [
    {
      question: 'How do I submit my work (song/photo/video) for consideration?',
      answer:
        'Go to Profile → Upload for Consideration and submit your work. The UNAP team will review it and notify you.',
    },
    {
      question: 'Why do I need to promote my release within 72 hours?',
      answer:
        "Early promotion is crucial for algorithmic momentum. The first 72 hours significantly impact your release's visibility and performance across streaming platforms.",
    },
    {
      question: "What happens if I don't promote within 72 hours?",
      answer:
        'Your release may receive less initial traction and lower algorithmic priority, potentially affecting its overall performance and reach.',
    },
    {
      question: 'Can I turn off email or SMS notifications?',
      answer:
        'Yes, you can manage your notification preferences in Settings. Navigate to Notifications and toggle email or SMS options on or off.',
    },
    {
      question: 'Why do official posts have a watermark?',
      answer:
        'Watermarks help protect content authenticity and prevent unauthorized use. They ensure official posts are easily identifiable and credited properly.',
    },
  ];

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
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
              Faq
            </Text>
          </View>
          <View className='border-b border-black/20 dark:border-[#FFFFFF0D] dark:border-[#FFFFFF0D] w-full mt-2'></View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 72, marginHorizontal: 24 }}
          >
            <View className='mt-6'>
              {faqData.map((item, index) => (
                <FAQItem
                  key={index}
                  question={item.question}
                  answer={item.answer}
                  isOpen={openIndex === index}
                  onToggle={() => handleToggle(index)}
                />
              ))}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default Faq;
