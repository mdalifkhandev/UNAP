import { Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import useThemeStore from "@/store/theme.store";

const OfficePostCard = ({ className }: { className?: string }) => {
  const { mode } = useThemeStore();
  const iconColor = mode === "light" ? "#9CA3AF" : "white";

  return (
    <View className={`bg-[#F0F2F5] dark:bg-[#FFFFFF0D] rounded-3xl ${className} `}>
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
                color={iconColor}
              />
              <Text className="font-roboto-semibold text-sm text-primary dark:text-white">
                UNAP Official
              </Text>
            </View>
            <Text className="font-roboto-regular text-sm text-primary dark:text-white mt-2.5">
              2h ago
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity className="py-2 px-6 rounded-full items-center justify-center">
          <Text className="font-roboto-semibold text-primary dark:text-white">Follow </Text>
        </TouchableOpacity>
      </View>

      {/* time notis */}

      <View className="flex-row items-center justify-center gap-4 pb-2.5">
        <MaterialCommunityIcons
          name="clock-time-four-outline"
          size={24}
          color={iconColor}
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
      <View className="p-3 flex-row justify-between items-center">
        <View className="flex-row gap-4">
          <TouchableOpacity>
            <Ionicons name="heart-outline" size={26} color={iconColor} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="chatbubble-outline" size={24} color={iconColor} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="share-social-outline" size={24} color={iconColor} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity>
          {/* <Feather name="bookmark" size={24} color="black" /> */}
          <Ionicons name="bookmark-outline" size={24} color={iconColor} />
        </TouchableOpacity>
      </View>

      {/* post description */}
      <View className="px-6 ">
        <Text className="font-roboto-regular text-primary dark:text-white">
          🎵 New Release Alert! Check out "Summer Vibes" by @ArtistName - Out
          now on all platforms!
          {"\n "}
          {"\n "}
          Support your fellow UNAP artists by sharing this release. Remember,
          you have 72 hours to share!
        </Text>
        <Text className="font-roboto-semibold text-sm text-primary dark:text-white mt-2.5 mb-6">
          6h ago
        </Text>
      </View>
    </View>
  );
};

export default OfficePostCard;
