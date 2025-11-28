import OfficePostCard from "@/components/card/OfficePostCard";
import PostCard from "@/components/card/PostCard";
import SuggestedArtistsCard from "@/components/card/SuggestedArtistsCard";
import Input from "@/components/inpute/Inpute";
import GradientBackground from "@/components/main/GradientBackground";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
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

const Home = () => {
  const video = require("@/assets/images/postvideo.png");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const handleImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  return (
    <GradientBackground>
      <SafeAreaView
        className="flex-1 mx-6 mt-2.5 mb-17"
        edges={["top", "left", "right"]}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 72 }}
          >
            {/* home header */}
            <View className="flex-row justify-between items-center mx-4 mt-3">
              <TouchableOpacity>
                <Image
                  source={require("@/assets/images/logo.png")}
                  style={{ width: 60, height: 26 }}
                  contentFit="contain"
                />
              </TouchableOpacity>
              <View className="flex-row gap-3 items-center">
                <TouchableOpacity
                  onPress={() => router.push("/screens/home/notification")}
                >
                  <Ionicons
                    name="notifications-outline"
                    size={24}
                    color="white"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => router.push("/(tabs)/profile")}
                >
                  <Image
                    source={require("@/assets/images/profile.png")}
                    style={{
                      width: 30,
                      height: 30,
                    }}
                    contentFit="contain"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* post create card */}
            <View className="p-6 bg-[#FFFFFF0D] rounded-3xl mt-6 flex-row gap-5">
              <TouchableOpacity
                onPress={() => router.push("/(tabs)/profile")}
                className="mt-2"
              >
                <Image
                  source={require("@/assets/images/profile.png")}
                  style={{
                    width: 30,
                    height: 30,
                  }}
                  contentFit="contain"
                />
              </TouchableOpacity>
              <View className=" flex-1">
                <Input placeholder="What's on your mind?" inputeStyle="pb-10" />
                <View className="flex-row justify-between mt-5">
                  <View className="flex-row gap-6">
                    <TouchableOpacity
                      onPress={handleImagePicker}
                      className="flex-row items-center gap-2"
                    >
                      <Feather name="image" size={18} color="white" />
                      <Text className="text-white">Photo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-row items-center gap-2">
                      <Feather name="link" size={18} color="white" />
                      <Text className="text-white">Link</Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity className="px-4 py-2 bg-primary rounded-xl">
                    <Text className="">Post</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* post card */}
            <PostCard className="mt-4" />
            <OfficePostCard className="mt-4" />
            <SuggestedArtistsCard className="mt-4" />
            <PostCard img={video} className="mt-4" />

            {/* ..........end......... */}
            {/* ..........end......... */}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default Home;
