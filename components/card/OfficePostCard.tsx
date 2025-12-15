import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import Fontisto from "@expo/vector-icons/Fontisto";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const OfficePostCard = ({ className }: { className?: string }) => {
  return (
    <View className={`bg-[#FFFFFF0D] rounded-3xl ${className} `}>
      {/* post header */}
      <View className="p-4 flex-row justify-between items-center">
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/profile")}
          className="flex-row gap-3"
        >
          <Image
            source={require("@/assets/images/profile.png")}
            style={{ width: 40, height: 40 }}
            contentFit="contain"
          />
          <View>
            <View className="flex-row gap-3">
              <MaterialCommunityIcons
                name="check-decagram"
                size={20}
                color="white"
              />
              <Text className="font-roboto-semibold text-sm text-primary">
                UNAP Official
              </Text>
            </View>
            <Text className="font-roboto-regular text-sm text-primary mt-2.5">
              2h ago
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity className="py-2 px-6 rounded-full items-center justify-center">
          <Text className="font-roboto-semibold text-primary">Follow </Text>
        </TouchableOpacity>
      </View>

      {/* time notis */}

      <View className="flex-row items-center justify-center gap-4 pb-2.5">
        <MaterialCommunityIcons
          name="clock-time-four-outline"
          size={24}
          color="white"
        />
        <Text className="text-red-500 text-center">
          Share required: 2 hour remaining
        </Text>
      </View>

      {/* post image  */}
      <Image
        source={require("@/assets/images/post.png")}
        style={{
          width: "100%",
          height: 345,
        }}
        contentFit="cover"
      />

      {/* like comment sheire */}
      <View className="p-6 flex-row justify-between items-center">
        <View className="flex-row gap-4">
          <TouchableOpacity>
            <Feather name="heart" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Fontisto name="comment" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <AntDesign name="share-alt" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity>
          <Feather name="bookmark" size={24} color="white" />
        </TouchableOpacity>
      </View>
      {/* post description */}
      <View className="px-6 ">
        <Text className="font-roboto-regular text-primary">
          🎵 New Release Alert! Check out "Summer Vibes" by @ArtistName - Out
          now on all platforms!
          {"\n "}
          {"\n "}
          Support your fellow UNAP artists by sharing this release. Remember,
          you have 72 hours to share!
        </Text>
        <Text className="font-roboto-semibold text-sm text-primary mt-2.5 mb-6">
          6h ago
        </Text>
      </View>
    </View>
  );
};

export default OfficePostCard;
