import {
  useBlockUser,
  useClearConversation,
  useUnblockUser,
} from '@/hooks/app/chat';
import { useTranslateTexts } from '@/hooks/app/translate';
import useLanguageStore from '@/store/language.store';
import React, { useEffect, useState } from 'react';
import { Alert, Modal, Text, TouchableOpacity, View } from 'react-native';

const ChatSettings = ({
  showMenu,
  setShowMenu,
  userId,
  isBlockedByMe,
}: {
  showMenu: boolean;
  setShowMenu: (visible: boolean) => void;
  userId: string;
  isBlockedByMe: boolean;
}) => {
  const [isBlocked, setIsBlocked] = useState(Boolean(isBlockedByMe));

  useEffect(() => {
    setIsBlocked(Boolean(isBlockedByMe));
  }, [isBlockedByMe]);

  const { language } = useLanguageStore();
  const { mutate: clearConversation, isPending: isClearingConversation } =
    useClearConversation();
  const { mutate: blockUser, isPending: isBlockingUser } = useBlockUser();
  const { mutate: unblockUser, isPending: isUnblockingUser } =
    useUnblockUser();
  const isBusy = isClearingConversation || isBlockingUser || isUnblockingUser;
  const { data: t } = useTranslateTexts({
    texts: [
      'Delete conversation',
      'Block',
      'Unblock',
      'Are you sure you want to clear this conversation?',
      'Are you sure you want to block this user?',
      'Are you sure you want to unblock this user?',
      'Cancel',
      'Yes',
    ],
    targetLang: language,
    enabled: !!language && language !== 'EN',
  });
  const tx = (i: number, fallback: string) =>
    t?.translations?.[i] || fallback;

  const handleDeleteConversation = () => {
    setShowMenu(false);
    Alert.alert(
      tx(0, 'Delete conversation'),
      tx(3, 'Are you sure you want to clear this conversation?'),
      [
        { text: tx(6, 'Cancel'), style: 'cancel' },
        {
          text: tx(7, 'Yes'),
          style: 'destructive',
          onPress: () => clearConversation(userId),
        },
      ]
    );
  };

  const handleBlock = () => {
    setShowMenu(false);
    Alert.alert(tx(1, 'Block'), tx(4, 'Are you sure you want to block this user?'), [
      { text: tx(6, 'Cancel'), style: 'cancel' },
      {
        text: tx(7, 'Yes'),
        style: 'destructive',
        onPress: () =>
          blockUser(userId, {
            onSuccess: () => setIsBlocked(true),
          }),
      },
    ]);
  };

  const handleUnblock = () => {
    setShowMenu(false);
    Alert.alert(
      tx(2, 'Unblock'),
      tx(5, 'Are you sure you want to unblock this user?'),
      [
        { text: tx(6, 'Cancel'), style: 'cancel' },
        {
          text: tx(7, 'Yes'),
          onPress: () =>
            unblockUser(userId, {
              onSuccess: () => setIsBlocked(false),
            }),
        },
      ]
    );
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
            disabled={isBusy}
            className='px-4 py-4 border-b border-gray-200 active:bg-gray-100'
          >
            <Text className='text-gray-900 text-base'>
              {tx(0, 'Delete conversation')}
            </Text>
          </TouchableOpacity>

          {isBlocked ? (
            <TouchableOpacity
              onPress={handleUnblock}
              disabled={isBusy}
              className='px-4 py-4 active:bg-gray-100'
            >
              <Text className='text-gray-900 text-base'>{tx(2, 'Unblock')}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={handleBlock}
              disabled={isBusy}
              className='px-4 py-4 active:bg-gray-100'
            >
              <Text className='text-gray-900 text-base'>{tx(1, 'Block')}</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default ChatSettings;
