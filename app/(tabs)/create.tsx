import GradientBackground from "@/components/main/GradientBackground";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import Foundation from "@expo/vector-icons/Foundation";
import Octicons from "@expo/vector-icons/Octicons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
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

const CreatePost = () => {
  const [isFacebook, setIsFacebook] = useState(false);
  const [isInstagram, setIsInstagram] = useState(false);

  return (
    <GradientBackground>
      <SafeAreaView className="flex-1  " edges={["top", "left", "right"]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          {/* header */}
          <View className="mt-3 flex-row items-center mx-6 justify-between">
            <TouchableOpacity onPress={() => router.back()}>
              <AntDesign name="close" size={22} color="white" />
            </TouchableOpacity>
            <Text className="font-roboto-bold text-primary text-2xl">
              Create Post
            </Text>
            <TouchableOpacity className="px-4 py-2 rounded-full bg-primary">
              <Text className="font-roboto-semibold  "> Post</Text>
            </TouchableOpacity>
          </View>

          {/* border */}
          <View className="border-b border-[#292929] w-full mt-2"></View>

          {/* scroll view */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 72, marginHorizontal: 24 }}
          >
            {/* uplode icon */}
            <View className="items-center mt-11">
              <Feather name="upload" size={80} color="#6B7280" />
              <Text className="text-primary  mt-6 font-roboto-regular text-xl">
                Choose content type
              </Text>
            </View>

            {/* uplode type icon  */}
            <View className="flex-row justify-center items-center gap-6 mt-11">
              <View className="bg-[#FFFFFF0D] px-5 py-4 rounded-lg">
                <Foundation name="photo" size={40} color="#9810FA" />
                <Text className="text-primary font-roboto-regular mt-1">
                  Photo
                </Text>
              </View>
              <View className="bg-[#FFFFFF0D] px-5 py-4 rounded-lg">
                <Feather name="video" size={40} color="#E60076" />
                <Text className="text-primary font-roboto-regular mt-1">
                  Photo
                </Text>
              </View>
              <View className="bg-[#FFFFFF0D] px-5 py-4 rounded-lg">
                <Feather name="music" size={40} color="#F54900" />
                <Text className="text-primary font-roboto-regular mt-1">
                  Photo
                </Text>
              </View>
            </View>

            {/* share with */}
            <View className="p-4 bg-[#FFFFFF0D] rounded-lg mt-7 flex-row justify-between items-center">
              <View className="flex-row gap-3 items-center">
                <Feather name="facebook" size={24} color="white" />
                <Text className="text-primary">Share with Facebook</Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsFacebook(!isFacebook)}
                className="h-8 w-8 rounded-full border border-white flex-row justify-center items-center"
              >
                <Octicons
                  name="dot-fill"
                  size={26}
                  color={isFacebook ? "#0C8CE9" : "#FFFFFF"}
                />
              </TouchableOpacity>
            </View>

            {/* share with */}
            <View className="p-4 bg-[#FFFFFF0D] rounded-lg mt-7 flex-row justify-between items-center">
              <View className="flex-row gap-3 items-center">
                <SimpleLineIcons
                  name="social-instagram"
                  size={24}
                  color="white"
                />
                <Text className="text-primary">Share with Instagram</Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsInstagram(!isInstagram)}
                className="h-8 w-8 rounded-full border border-white flex-row justify-center items-center"
              >
                <Octicons
                  name="dot-fill"
                  size={26}
                  color={isInstagram ? "#0C8CE9" : "#FFFFFF"}
                />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default CreatePost;
