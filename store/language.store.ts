import AsyncStorage from '@react-native-async-storage/async-storage';
import { create, StateCreator } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';

type LanguageStore = {
  language: string;
  setLanguage: (language: string) => void;
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

type LanguagePersist = (
  config: StateCreator<LanguageStore>,
  options: PersistOptions<LanguageStore>
) => StateCreator<LanguageStore>;

const useLanguageStore = create<LanguageStore>()(
  (persist as LanguagePersist)(
    (set) => ({
      language: 'EN',
      setLanguage: (language: string) => set({ language }),
    }),
    {
      name: 'language-storage',
      storage,
    }
  )
);

export default useLanguageStore;
