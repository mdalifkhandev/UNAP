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

export const useSocketChat = (currentUserId: string, currentConversationId: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<any>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = connectSocket();

    if (!socket) return;

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Socket connected');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    socket.on('message:new', (payload: { message: Message; conversationId: string }) => {
      console.log('New message received:', payload);

      // Only update if this message belongs to current conversation
      if (payload.conversationId === currentConversationId) {
        // Update messages in current chat
        queryClient.setQueryData(['chat', currentUserId], (oldData: any) => {
          if (!oldData?.messages) return oldData;

          return {
            ...oldData,
            messages: [...oldData.messages, payload.message]
          };
        });
      }

      // Always update chat list to show new last message
      queryClient.invalidateQueries({ queryKey: ['chatlist'] });
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
    });

    return () => {
      disconnectSocket(socket);
    };
  }, [currentUserId, currentConversationId, queryClient]);

  const sendMessage = (recipientId: string, text: string) => {
    if (!socketRef.current || !isConnected) {
      console.error('Socket not connected');
      return Promise.reject(new Error('Socket not connected'));
    }

    return new Promise((resolve, reject) => {
      socketRef.current.emit('message:send',
        { recipientId, text },
        (ack: { ok: boolean; message?: Message; conversationId?: string; error?: string }) => {
          if (!ack.ok) {
            console.error('Send message error:', ack.error);
            reject(new Error(ack.error));
            return;
          }

          console.log('Message sent successfully:', ack.message);

          // Don't add message here - let the 'message:new' event handle it
          // This prevents duplicate messages
          // Update chat list
          queryClient.invalidateQueries({ queryKey: ['chatlist'] });

          resolve(ack.message);
        }
      );
    });
  };

  return {
    isConnected,
    sendMessage
  };
};
