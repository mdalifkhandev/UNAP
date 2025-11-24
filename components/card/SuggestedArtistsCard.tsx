import React from "react";
import { Text, View } from "react-native";

const SuggestedArtistsCard = ({ className }: { className?: string }) => {
  return (
    <View className={`bg-[#FFFFFF0D] rounded-3xl ${className} `}>
      <Text>SuggestedArtists</Text>
    </View>
  );
};

export default SuggestedArtistsCard;
