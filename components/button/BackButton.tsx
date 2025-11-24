import Entypo from "@expo/vector-icons/Entypo";
import { router } from "expo-router";
import React from "react";
import { TouchableOpacity } from "react-native";

const BackButton = ({ className }: { className?: string }) => {
  return (
    <TouchableOpacity onPress={() => router.back()} className={`${className}`}>
      <Entypo name="chevron-left" size={24} color="white" />
    </TouchableOpacity>
  );
};

export default BackButton;
