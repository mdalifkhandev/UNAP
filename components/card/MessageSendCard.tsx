import React from "react";
import { Text, View } from "react-native";

const MessageSendCard = () => {
  return (
    <View className="flex-row gap-3 justify-end mt-9">
      <View className="bg-[#FFFFFF0D] border-[#EEEEEE] border rounded-[10px] w-[75%] py-2.5 px-3">
        <Text className="font-roboto-regular text-primary">
          Hey! How was the new design project coming along?
        </Text>
        <Text className=" text-sm font-roboto-regular text-primary mt-3">
          11:00 AM
        </Text>
      </View>
    </View>
  );
};

export default MessageSendCard;
