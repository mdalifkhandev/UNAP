import Entypo from "@expo/vector-icons/Entypo";
import { router } from "expo-router";
import React from "react";
import { TouchableOpacity } from "react-native";
import useThemeStore from "@/store/theme.store";

const BackButton = ({ className }: { className?: string }) => {
  const { mode } = useThemeStore();
  const iconColor = mode === "light" ? "black" : "white";

  return (
    <TouchableOpacity onPress={() => router.back()} className={`${className}`}>
      <Entypo name="chevron-left" size={24} color={iconColor} />
    </TouchableOpacity>
  );
};

export default BackButton;
