import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type NotificationCardProps = {
  img: any;
  name: string;
  reson: string;
  time: string;
  className?: string;
};

const NotificationCard = ({
  img,
  name,
  reson,
  time,
  className,
}: NotificationCardProps) => {
  return (
    <View
      className={`bg-[#FFFFFF0D] py-5 px-4 rounded-xl flex-row justify-between gap-5 ${className} `}
    >
      <TouchableOpacity onPress={() => router.push("/(tabs)/profile")}>
        <Image
          source={img}
          style={{
            width: 40,
            height: 40,
          }}
          contentFit="contain"
        />
      </TouchableOpacity>
      <View className="flex-1 ">
        <Text className="font-roboto-semibold text-primary text-lg">
          {name}
        </Text>
        <Text className="font-roboto-regular text-sm text-primary mt-1">
          {reson}
        </Text>
        <Text className="font-roboto-regular text-sm text-primary mt-1">
          {" "}
          {time}
        </Text>
      </View>
      <TouchableOpacity>
        <MaterialCommunityIcons name="dots-vertical" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default NotificationCard;
