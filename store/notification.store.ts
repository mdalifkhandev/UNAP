import AsyncStorage from '@react-native-async-storage/async-storage';
import { create, StateCreator } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';

export type InAppNotification = {
  id: string;
  title: string;
  body: string;
  type: string;
  createdAt: string;
  read: boolean;
  screen?: string;
  data?: Record<string, string>;
};

type NotificationStore = {
  notifications: InAppNotification[];
  badgeCount: number;
  addNotification: (item: Omit<InAppNotification, 'createdAt' | 'read'> & {
    createdAt?: string;
    read?: boolean;
  }) => void;
  markAsRead: (id: string) => void;
  resetBadgeCount: () => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
};

const storage = {
  getItem: async (name: string) => {
    const item = await AsyncStorage.getItem(name);
    return item ? JSON.parse(item) : null;
  },
  setItem: async (name: string, value: any) => {
    await AsyncStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: async (name: string) => {
    await AsyncStorage.removeItem(name);
  },
};

type NotificationPersist = (
  config: StateCreator<NotificationStore>,
  options: PersistOptions<NotificationStore>
) => StateCreator<NotificationStore>;

const MAX_ITEMS = 100;

const useNotificationStore = create<NotificationStore>()(
  (persist as NotificationPersist)(
    set => ({
      notifications: [],
      badgeCount: 0,
      addNotification: item =>
        set(state => {
          const alreadyExists = state.notifications.some(n => n.id === item.id);
          const next = {
            id: item.id,
            title: item.title,
            body: item.body,
            type: item.type || 'system',
            createdAt: item.createdAt || new Date().toISOString(),
            read: Boolean(item.read),
            screen: item.screen,
            data: item.data,
          } satisfies InAppNotification;

          const deduped = state.notifications.filter(n => n.id !== next.id);
          const nextBadgeCount =
            !alreadyExists && !next.read ? state.badgeCount + 1 : state.badgeCount;

          return {
            notifications: [next, ...deduped].slice(0, MAX_ITEMS),
            badgeCount: nextBadgeCount,
          };
        }),
      markAsRead: id =>
        set(state => ({
          notifications: state.notifications.map(item =>
            item.id === id ? { ...item, read: true } : item
          ),
        })),
      resetBadgeCount: () => set({ badgeCount: 0 }),
      removeNotification: id =>
        set(state => ({
          notifications: state.notifications.filter(item => item.id !== id),
        })),
      clearNotifications: () => set({ notifications: [], badgeCount: 0 }),
    }),
    {
      name: 'notification-storage',
      storage,
    }
  )
);

export const getNotificationStore = () => useNotificationStore.getState();

export default useNotificationStore;
