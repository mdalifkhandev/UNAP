import ShadowButton from "@/components/button/ShadowButton";
import GradientBackground from "@/components/main/GradientBackground";
import useAuthStore from '@/store/auth.store';
import Feather from "@expo/vector-icons/Feather";
import Foundation from "@expo/vector-icons/Foundation";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ResizeMode, Video } from "expo-av";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Profiles = () => {
  const { user } = useAuthStore();
  console.log(user);

  // Selected post type state
  const [selectedType, setSelectedType] = useState<"photo" | "video" | "music">("photo");

  // Dummy posts (API-ready structure)
  const posts = [
    { id: 1, type: "photo", uri: "https://i.pravatar.cc/150?img=11" },
    { id: 2, type: "photo", uri: "https://i.pravatar.cc/150?img=12" },
    { id: 3, type: "video", uri: "https://www.w3schools.com/html/mov_bbb.mp4" },
    { id: 4, type: "music", uri: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
    { id: 5, type: "photo", uri: "https://i.pravatar.cc/150?img=13" },
    { id: 6, type: "video", uri: "https://www.w3schools.com/html/mov_bbb.mp4" },
    { id: 7, type: "video", uri: "https://www.w3schools.com/html/mov_bbb.mp4" },
    { id: 8, type: "video", uri: "https://www.w3schools.com/html/mov_bbb.mp4" },
  ];

  // Filter posts based on selected type
  const filteredPosts = posts.filter((post) => post.type === selectedType);

  return (
    <GradientBackground>
      <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          {/* headers */}
          <View className="mt-3 flex-row items-center mx-6 justify-between">
            <Text className="font-roboto-bold text-primary text-2xl text-center flex-1">
              Profile
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/screens/profile/settings/settings")}
            >
              <Ionicons name="settings-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <View className="border-b border-[#292929] w-full mt-2"></View>

          <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
            {/* profile picture */}
            <View className="flex-row gap-4 mt-4 items-center mx-6">
              <TouchableOpacity className="mt-2">
                <Image
                  source={{ uri: "https://randomuser.me/api/portraits/men/44.jpg" }}
                  style={{ width: 100, height: 100, borderRadius: 100 }}
                  contentFit="contain"
                />
              </TouchableOpacity>
              <View>
                <Text className="text-primary font-roboto-bold text-2xl">
                  {user?.name}
                </Text>
                <Text className="text-primary font-roboto-regular text-lg">
                  Singer • Producer • {"\n"}Creator 🎵
                </Text>
              </View>
            </View>

            {/* details */}
            <View className="mt-3 mx-6">
              <Text className="font-roboto-medium text-primary">
                Making music that moves people ✨
              </Text>
              <Text className="font-roboto-medium text-primary">
                New EP dropping soon 🎧
              </Text>
              <Text className="font-roboto-medium text-primary ">
                📍 Los Angeles, CA
              </Text>
            </View>

            {/* border */}
            <View className="border-b border-[#292929] w-full my-3 mx-6"></View>

            {/* post stats */}
            <View className="flex-row justify-between items-center mt-3 py-3 mx-6">
              <View>
                <Text className="text-primary text-center font-roboto-semibold text-2xl">
                  127
                </Text>
                <Text className="text-secondary text-center font-roboto-regular text-lg">
                  Posts
                </Text>
              </View>
              <View>
                <Text className="text-primary text-center font-roboto-semibold text-2xl">
                  10.2K
                </Text>
                <Text className="text-secondary text-center font-roboto-regular text-lg">
                  Followers
                </Text>
              </View>
              <View>
                <Text className="text-primary text-center font-roboto-semibold text-2xl">
                  892
                </Text>
                <Text className="text-secondary text-center font-roboto-regular text-lg">
                  Following
                </Text>
              </View>
            </View>

            {/* border */}
            <View className="border-b border-[#292929] w-full my-3 mx-6"></View>

            {/* edit/share buttons */}
            <View className="flex-row justify-center items-center gap-5 mx-6">
              <ShadowButton
                text="Edit Profile"
                textColor="#2B2B2B"
                backGroundColor="#E8EBEE"
                onPress={() => router.push("/screens/profile/edit-profile")}
                className="mt-4"
              />
              <ShadowButton
                text="Share Profile"
                textColor="#E6E6E6"
                backGroundColor="#000000"
                onPress={() => router.push("/(tabs)/home")}
                className="mt-4 border border-[#E6E6E6]"
              />
            </View>

            {/* border */}
            <View className="border-b border-[#292929] w-full mt-24 mx-6"></View>

            {/* post filter buttons */}
            <View className="flex-row justify-between items-center gap-6 mt-3 mx-6">
              {["photo", "video", "music"].map((type) => {
                const Icon = type === "photo" ? Foundation : Feather;
                const iconName = type === "photo" ? "photo" : type === "video" ? "video" : "music";
                return (
                  <TouchableOpacity
                    key={type}
                    onPress={() => setSelectedType(type as "photo" | "video" | "music")}
                    className={`px-5 py-4 rounded-lg flex-row gap-2 items-center ${selectedType === type ? "bg-[#444]" : "bg-transparent"
                      }`}
                  >
                    <Icon name={iconName as any} size={24} color="white" />
                    <Text className="text-primary font-roboto-regular mt-1">
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* post data */}
            <View className="flex-row flex-wrap mt-3 mx-6">
              {filteredPosts.length > 0 ? filteredPosts.map((item) => (
                <View key={item.id} className="w-1/3 border border-white">
                  {item.type === "photo" && (
                    <Image
                      source={{ uri: item.uri }}
                      style={{ width: "100%", height: 130, borderWidth: 1, borderColor: "white" }}
                      contentFit="cover"
                    />
                  )}
                  {item.type === "video" && (
                    <View style={{ width: "100%", height: 130, padding: 2 }}>
                      <Video
                        source={{ uri: item.uri }}
                        style={{ width: "100%", height: "100%" }}
                        useNativeControls={false}
                        resizeMode={ResizeMode.COVER}
                        isLooping
                        isMuted
                        onError={(error) => console.log("Video error:", error)}
                      />
                      <View className="absolute inset-0 items-center justify-center">
                        <Feather name="video" size={24} color="white" opacity={0.7} />
                      </View>
                    </View>
                  )}
                  {item.type === "music" && (
                    <View className="p-4 bg-[#292929] items-center justify-center">
                      <Feather name="music" size={40} color="#F54900" />
                      <Text className="text-white mt-2 text-center text-sm">
                        Audio File
                      </Text>
                    </View>
                  )}
                </View>
              )) : (
                <Text className="text-primary font-roboto-regular mt-1">
                  No {selectedType} posts found
                </Text>
              )}
            </View>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default Profiles;
