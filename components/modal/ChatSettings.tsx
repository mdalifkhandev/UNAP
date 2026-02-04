import { useTranslateTexts } from '@/hooks/app/translate';
import useLanguageStore from '@/store/language.store';
import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';

const ChatSettings = ({ showMenu, setShowMenu }: any) => {
  const { language } = useLanguageStore();
  const { data: t } = useTranslateTexts({
    texts: [
      'Delete conversation',
      'Delete conversation clicked',
      'Block',
      'Block clicked',
    ],
    targetLang: language,
    enabled: !!language && language !== 'EN',
  });
  const tx = (i: number, fallback: string) =>
    t?.translations?.[i] || fallback;

  const handleDeleteConversation = () => {
    setShowMenu(false);
    alert(tx(1, 'Delete conversation clicked'));
  };

  const handleBlock = () => {
    setShowMenu(false);
    alert(tx(3, 'Block clicked'));
  };
  return (
    <Modal
      visible={showMenu}
      transparent={true}
      animationType='fade'
      onRequestClose={() => setShowMenu(false)}
    >
      <TouchableOpacity
        className='flex-1 bg-black/50'
        activeOpacity={1}
        onPress={() => setShowMenu(false)}
      >
        <View className='absolute right-4 top-24 bg-white rounded-lg shadow-2xl w-56 overflow-hidden'>
          <TouchableOpacity
            onPress={handleDeleteConversation}
            className='px-4 py-4 border-b border-gray-200 active:bg-gray-100'
          >
            <Text className='text-gray-900 text-base'>
              {tx(0, 'Delete conversation')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleBlock}
            className='px-4 py-4 active:bg-gray-100'
          >
            <Text className='text-gray-900 text-base'>{tx(2, 'Block')}</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default ChatSettings;
