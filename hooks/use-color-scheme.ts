import { useColorScheme as useRNColorScheme } from "react-native";
import useThemeStore from "@/store/theme.store";

export function useColorScheme() {
  const { mode } = useThemeStore();
  return mode ?? useRNColorScheme() ?? "dark";
}