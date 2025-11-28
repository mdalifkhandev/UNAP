import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type NotificationUpFollowCardProps = {
  img: any;
  name: string;
  reson: string;
  time: string;
  className?: string;
  type?: "like" | "follow" | "10000";
};

const NotificationUpFollowCard = ({
  img,
  name,
  reson,
  time,
  className,
  type,
}: NotificationUpFollowCardProps) => {
  return (
    <View
      className={`bg-[#FFFFFF0D] py-5 px-4 rounded-xl flex-row justify-between gap-5 ${className} `}
    >
      <TouchableOpacity
        onPress={() => router.push("/(tabs)/profile")}
        className="relative"
      >
        <View className="bg-[#FCE7F3] p-2 rounded-full">
          <Feather name="music" size={24} color="#F54900" />
        </View>
      </TouchableOpacity>
      <View className="flex-1 ">
        <Text className="font-roboto-semibold text-primary text-lg capitalize">
          {name}
        </Text>
        <Text className="font-roboto-regular text-sm text-primary mt-1 capitalize">
          {reson}
        </Text>
        <Text className="font-roboto-regular text-sm text-primary mt-1 capitalize">
          {time}
        </Text>
      </View>
      <TouchableOpacity>
        <MaterialCommunityIcons name="dots-vertical" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default NotificationUpFollowCard;
