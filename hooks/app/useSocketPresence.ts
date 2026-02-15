import { connectSocket, disconnectSocket } from '@/lib/socketClient';
import { getAuth } from '@/store/auth.store';
import { useEffect, useRef, useState } from 'react';

type PresencePayload = {
  userId?: string;
  id?: string;
  status?: 'online' | 'offline';
  online?: boolean;
  onlineUserIds?: string[];
};

export const useSocketPresence = () => {
  const [onlineIds, setOnlineIds] = useState<Set<string>>(new Set());
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<any>(null);

  useEffect(() => {
    const socket = connectSocket();
    if (!socket) return;

    socketRef.current = socket;
    const auth = getAuth();
    const myId = auth.user?.id;

    const setOnlineList = (ids: string[]) => {
      setOnlineIds(new Set((ids || []).filter(Boolean).map((id) => String(id))));
    };

    const addOnline = (id?: string) => {
      if (!id) return;
      setOnlineIds(prev => {
        const next = new Set(prev);
        next.add(String(id));
        return next;
      });
    };

    const removeOnline = (id?: string) => {
      if (!id) return;
      setOnlineIds(prev => {
        const next = new Set(prev);
        next.delete(String(id));
        return next;
      });
    };

    socket.on('connect', () => {
      setIsConnected(true);
      if (myId) {
        socket.emit('presence:join', { userId: myId });
      }
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      setOnlineIds(new Set());
    });

    socket.on('presence:list', (payload: PresencePayload | string[]) => {
      if (Array.isArray(payload)) {
        setOnlineList(payload);
        return;
      }
      if (Array.isArray(payload?.onlineUserIds)) {
        setOnlineList(payload.onlineUserIds);
      }
    });

    socket.on('presence:update', (payload: PresencePayload) => {
      const id = payload?.userId || payload?.id;
      if (!id) return;
      if (payload?.status === 'online' || payload?.online === true) addOnline(id);
      if (payload?.status === 'offline' || payload?.online === false) removeOnline(id);
    });

    socket.on('user:online', (payload: PresencePayload) => {
      addOnline(payload?.userId || payload?.id);
    });

    socket.on('user:offline', (payload: PresencePayload) => {
      removeOnline(payload?.userId || payload?.id);
    });

    return () => {
      if (myId) {
        socket.emit('presence:leave', { userId: myId });
      }
      disconnectSocket(socket);
    };
  }, []);

  const isUserOnline = (userId?: string | null) =>
    !!userId && onlineIds.has(String(userId));

  return { onlineIds, isUserOnline, isConnected };
};
