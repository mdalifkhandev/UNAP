import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// User type
type TUser = {
  name: string;
  email: string;
  id: string;
  phoneNumber: string;
  refreshToken: string;
  token: string;
};

// Auth store type
type AuthStore = {
  email: string | null;
  user: TUser | null;
  setEmail: (email: string) => void;
  setUser: (user: TUser) => void;
  clearAuth: () => void;
};

// Custom storage adapter for AsyncStorage
const customStorage = {
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

// Zustand store with persist
const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      email: null,
      user: null,
      setEmail: (email: string) => set({ email }),
      setUser: (user: TUser) => set({ user }),
      clearAuth: () => set({ email: null, user: null }),
    }),
    {
      name: "auth-storage",
      storage: customStorage,
    }
  )
);

export default useAuthStore;
