import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const PostCard = ({ className, img }: { className?: string; img?: any }) => {
  const image = require("@/assets/images/post.png");

  return (
    <View className={`bg-[#FFFFFF0D] rounded-3xl ${className}`}>
      {/* post header */}
      <View className="p-4 flex-row justify-between items-center">
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/profile")}
          className="flex-row gap-3"
        >
          <Image
            source="https://thelightcommittee.com/wp-content/uploads/elementor/thumbs/studio-business-headshot-of-a-black-man-in-Los-Angeles-r42uipeyz48g590yz1bhrtos4flfu3q2tuzohhy7f4.jpg"
            style={{ width: 40, height: 40, borderRadius: 100 }}
            contentFit="cover"
          />
          <View>
            <Text className="font-roboto-semibold text-sm text-primary">
              Maya Lin
            </Text>
            <Text className="font-roboto-regular text-sm text-secondary">
              Painter
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity className="py-2 px-4 ">
          <Text className="font-roboto-semibold text-primary">Follow</Text>
        </TouchableOpacity>
      </View>

      {/* post image  */}
      <Image
        source={img || image}
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
            <Ionicons name="heart-outline" size={26} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="chatbubble-outline" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="share-social-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity>
          {/* <Feather name="bookmark" size={24} color="white" /> */}
          <Ionicons name="bookmark-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* post description */}
      <View className="px-3 pb-3">
        <Text className="font-roboto-regular text-primary">
          New abstract series exploring the {"\n"} intersection of light and
          shadow. What do you see? #AbstractArt #Minimalism #BlackAndWhite
        </Text>
        <Text className="font-roboto-semibold text-sm text-secondary mt-2.5">
          2h ago
        </Text>
      </View>
    </View>
  );
};

export default PostCard;
