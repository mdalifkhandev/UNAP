import Entypo from "@expo/vector-icons/Entypo";
import { router } from "expo-router";
import React from "react";
import { TouchableOpacity } from "react-native";

const BackButton = () => {
  return (
    <TouchableOpacity onPress={() => router.back()}>
      <Entypo name="chevron-left" size={24} color="white" />
    </TouchableOpacity>
  );
};

export default BackButton;
