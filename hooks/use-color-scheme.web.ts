import { useEffect, useState } from "react";
import { useColorScheme as useRNColorScheme } from "react-native";
import useThemeStore from "@/store/theme.store";

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 */
export function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false);
  const { mode } = useThemeStore();

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const colorScheme = useRNColorScheme();

  if (hasHydrated) {
    return mode ?? colorScheme ?? "dark";
  }

  return "dark";
}