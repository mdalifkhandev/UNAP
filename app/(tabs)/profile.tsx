import ShadowButton from "@/components/button/ShadowButton";
import GradientBackground from "@/components/main/GradientBackground";
import Feather from "@expo/vector-icons/Feather";
import Foundation from "@expo/vector-icons/Foundation";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
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
  const profileImages = [
    {
      id: 1,
      name: "Profile 1",
      image: "https://i.pravatar.cc/150?img=11",
    },
    {
      id: 2,
      name: "Profile 2",
      image: "https://i.pravatar.cc/150?img=12",
    },
    {
      id: 3,
      name: "Profile 3",
      image: "https://i.pravatar.cc/150?img=13",
    },
    {
      id: 4,
      name: "Profile 4",
      image: "https://i.pravatar.cc/150?img=14",
    },
    {
      id: 5,
      name: "Profile 5",
      image: "https://i.pravatar.cc/150?img=15",
    },
    {
      id: 6,
      name: "Profile 6",
      image: "https://i.pravatar.cc/150?img=16",
    },
  ];

  return (
    <GradientBackground>
      <SafeAreaView className="flex-1  " edges={["top", "left", "right"]}>
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
              onPress={() => router.push("/screens/home/notification")}
            >
              <Ionicons name="settings-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
          {/* border */}
          <View className="border-b border-[#292929] w-full mt-2"></View>
          <ScrollView className="mx-6" showsVerticalScrollIndicator={false}>
            {/* profile picture  */}
            <View className="flex-row gap-4 mt-4 items-center">
              <TouchableOpacity className="mt-2">
                <Image
                  source={{
                    uri: "https://randomuser.me/api/portraits/men/44.jpg",
                  }}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 100,
                  }}
                  contentFit="contain"
                />
              </TouchableOpacity>
              <View>
                <Text className="text-primary font-roboto-bold text-2xl">
                  Rokey Mahmud
                </Text>
                <Text className="text-primary font-roboto-regular text-lg">
                  Singer • Producer • {"\n"}Creator 🎵
                </Text>
              </View>
            </View>

            {/* details */}
            <View className="mt-3">
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
            <View className="border-b border-[#292929] w-full my-3"></View>

            {/* post flower flowing */}
            <View className="flex-row justify-between items-center mt-3 py-3">
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
            <View className="border-b border-[#292929] w-full my-3"></View>

            <View className="flex-row justify-center items-center gap-5">
              <ShadowButton
                text="Edit Profile"
                textColor="#2B2B2B"
                backGroundColor="#E8EBEE"
                onPress={() => router.push("/(tabs)/home")}
                className="mt-4"
              />
              <ShadowButton
                text="Share Profile"
                textColor="#E6E6E6"
                backGroundColor=""
                onPress={() => router.push("/(tabs)/home")}
                className="mt-4 border border-[#E6E6E6]"
              />
            </View>
            {/* border */}
            <View className="border-b border-[#292929] w-full mt-24"></View>

            {/* my profile post section */}
            <View className="flex-row justify-between items-center gap-6 mt-3">
              <TouchableOpacity className=" px-5 py-4 rounded-lg flex-row gap-2 items-center">
                <Foundation name="photo" size={24} color="white" />
                <Text className="text-primary font-roboto-regular mt-1">
                  Photo
                </Text>
              </TouchableOpacity>
              <TouchableOpacity className=" px-5 py-4 rounded-lg flex-row gap-2 items-center">
                <Feather name="video" size={24} color="white" />
                <Text className="text-primary font-roboto-regular mt-1">
                  Photo
                </Text>
              </TouchableOpacity>
              <TouchableOpacity className=" px-5 py-4 rounded-lg flex-row gap-2 items-center">
                <Feather name="music" size={24} color="white" />
                <Text className="text-primary font-roboto-regular mt-1">
                  Photo
                </Text>
              </TouchableOpacity>
            </View>

            {/* post data */}
            <View className="flex-row justify-between items-center mt-6 flex-wrap">
              {profileImages.map((ites, index) => (
                <View key={index}>
                  <Image
                    source={{ uri: ites.image }}
                    style={{
                      width: 128,
                      height: 130,
                    }}
                    contentFit="contain"
                  />
                </View>
              ))}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default Profiles;
