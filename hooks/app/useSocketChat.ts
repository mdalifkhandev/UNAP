import { connectSocket, disconnectSocket } from '@/lib/socketClient';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';

interface Message {
  _id: string;
  conversationId: string;
  senderId: string;
  recipientId: string;
  text: string;
  createdAt: string;
}

interface BlockUpdatePayload {
  blockerUserId: string;
  blockedUserId: string;
  blocked: boolean;
  updatedAt?: string;
}

export const useSocketChat = (
  peerUserId: string,
  currentConversationId: string,
  myUserId?: string
) => {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<any>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = connectSocket();

    if (!socket) return;

    socketRef.current = socket;

    socket.on('connect', () => {
      // console.log('Socket connected');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      // console.log('Socket disconnected');
      setIsConnected(false);
    });

    socket.on(
      'message:new',
      (payload: { message: Message; conversationId: string }) => {
        // For first message in a new chat, currentConversationId may be empty.
        const belongsToCurrentConversation =
          !currentConversationId || payload.conversationId === currentConversationId;

        if (belongsToCurrentConversation) {
          queryClient.setQueriesData(
            { queryKey: ['chat', peerUserId], exact: false },
            (oldData: any) => {
              if (!oldData?.pages || !Array.isArray(oldData.pages)) return oldData;

              // Prevent duplicate insertion if query was already refreshed.
              const exists = oldData.pages.some((page: any) =>
                (page?.messages || []).some(
                  (msg: any) => String(msg?._id || '') === String(payload.message._id || '')
                )
              );
              if (exists) return oldData;

              const lastIndex = oldData.pages.length - 1;
              const nextPages = oldData.pages.map((page: any, index: number) => {
                if (index !== lastIndex) return page;
                const messages = Array.isArray(page?.messages) ? page.messages : [];
                return {
                  ...page,
                  messages: [...messages, payload.message],
                  totalCount:
                    typeof page?.totalCount === 'number'
                      ? page.totalCount + 1
                      : page?.totalCount,
                };
              });

              return { ...oldData, pages: nextPages };
            }
          );
        }

        // Always update chat list to show new last message
        queryClient.invalidateQueries({ queryKey: ['chatlist'] });
      }
    );

    socket.on('chat:block-updated', (payload: BlockUpdatePayload) => {
      if (!payload || !peerUserId) return;

      const blockerUserId = String(payload.blockerUserId || '');
      const blockedUserId = String(payload.blockedUserId || '');
      const blocked = Boolean(payload.blocked);
      const me = String(myUserId || '');
      const peer = String(peerUserId || '');
      if (!me || !peer) return;

      const isThisConversation =
        (blockerUserId === me && blockedUserId === peer) ||
        (blockerUserId === peer && blockedUserId === me);

      if (!isThisConversation) return;

      queryClient.setQueriesData(
        { queryKey: ['chat', peerUserId], exact: false },
        (oldData: any) => {
          if (!oldData?.pages || !Array.isArray(oldData.pages) || oldData.pages.length === 0) {
            return oldData;
          }

          const nextPages = oldData.pages.map((page: any, index: number) => {
            if (index !== 0) return page;

            const participant = page?.participant || {};
            const nextParticipant = { ...participant };

            if (blockerUserId === me && blockedUserId === peer) {
              nextParticipant.blockedByMe = blocked;
            }
            if (blockerUserId === peer && blockedUserId === me) {
              nextParticipant.blockedMe = blocked;
            }

            return {
              ...page,
              participant: nextParticipant,
            };
          });

          return { ...oldData, pages: nextPages };
        }
      );

      queryClient.invalidateQueries({ queryKey: ['chatlist'] });
    });

    socket.on('connect_error', error => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
    });

    return () => {
      disconnectSocket(socket);
    };
  }, [peerUserId, currentConversationId, myUserId, queryClient]);

  const sendMessage = (recipientId: string, text: string) => {
    if (!socketRef.current || !isConnected) {
      console.error('Socket not connected');
      return Promise.reject(new Error('Socket not connected'));
    }

    return new Promise((resolve, reject) => {
      socketRef.current.emit(
        'message:send',
        { recipientId, text },
        (ack: {
          ok: boolean;
          message?: Message;
          conversationId?: string;
          error?: string;
        }) => {
          if (!ack.ok) {
            console.error('Send message error:', ack.error);
            reject(new Error(ack.error));
            return;
          }

          // console.log('Message sent successfully:', ack.message);

          // Don't add message here - let the 'message:new' event handle it
          // This prevents duplicate messages
          // Update chat list
          queryClient.invalidateQueries({ queryKey: ['chat', peerUserId], exact: false });
          queryClient.invalidateQueries({ queryKey: ['chatlist'] });

          resolve(ack.message);
        }
      );
    });
  };

  return {
    isConnected,
    sendMessage,
  };
};
