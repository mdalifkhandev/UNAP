import Entypo from "@expo/vector-icons/Entypo";
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
        <Text className="font-roboto-semibold text-primary text-2xl">
          {name}
        </Text>
        <Text className="font-roboto-regular text-primary mt-2">{reson}</Text>
        <Text className="font-roboto-regular text-primary mt-3">{time}</Text>
      </View>
      <TouchableOpacity>
        <Entypo name="dots-three-vertical" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default NotificationCard;
