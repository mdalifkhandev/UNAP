import React from "react";
import { Text, View } from "react-native";

const MessageSendCard = () => {
  return (
    <View className="flex-row gap-3 justify-end mt-9">
      <View className="bg-[#F0F2F5] dark:bg-[#FFFFFF0D] border-black/20 dark:border-[#FFFFFF0D] dark:border-[#FFFFFF0D] border rounded-[10px] w-[75%] py-2.5 px-3">
        <Text className="font-roboto-regular text-primary dark:text-white">
          Hey! How was the new design project coming along?
        </Text>
        <Text className=" text-sm font-roboto-regular text-primary dark:text-white mt-3">
          11:00 AM
        </Text>
      </View>
    </View>
  );
};

export default MessageSendCard;
