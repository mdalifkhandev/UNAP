import GradientBackground from "@/components/main/GradientBackground";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import Foundation from "@expo/vector-icons/Foundation";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { ResizeMode, Video } from "expo-av";
import * as DocumentPicker from "expo-document-picker";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import React, { useRef, useState } from "react";
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

  const [photo, setPhoto] = useState<string | null>(null);
  const [video, setVideo] = useState<string | null>(null);
  const [audio, setAudio] = useState<string | null>(null);

  const videoRef = useRef<Video>(null);
  const router = useRouter();

  // Photo pick
  const pickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled) setPhoto(result.assets[0].uri);
  };

  // Video pick
  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 1,
    });
    if (!result.canceled) {
      setVideo(result.assets[0].uri);
      setPhoto(null);
      setAudio(null);
    }
  };

  // Audio pick
  const pickAudio = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "audio/*",
        copyToCacheDirectory: true,
      });
      if (result.assets && result.assets.length > 0) {
        const audioUri = result.assets[0].uri;
        setAudio(audioUri);
        setPhoto(null);
        setVideo(null);
      }
    } catch (error) {
      console.error("Error picking audio:", error);
    }
  };

  // Sharing functions (optional, just for social preview)
  const shareToFacebook = async (fileUri: string | null) => {
    if (!fileUri) return;
    if (!(await Sharing.isAvailableAsync())) {
      alert("Sharing not available!");
      return;
    }
    await Sharing.shareAsync(fileUri, {
      dialogTitle: "Share on Facebook",
      UTI: "public.jpeg",
      mimeType: "*/*",
    });
  };

  const shareToInstagram = async (fileUri: string | null) => {
    if (!fileUri) return;
    const isSharingAvailable = await Sharing.isAvailableAsync();
    if (!isSharingAvailable) {
      alert("Sharing feature is not available on this device");
      return;
    }
    await Sharing.shareAsync(fileUri, {
      dialogTitle: "Share to Instagram Feed",
      mimeType: Platform.OS === "ios" ? "public.image" : "image/*",
    });
  };

  /** ======================= NEW: Prepare all post data ======================= */
  const handleCreatePost = async () => {
    const payload = {
      media: {
        photo: photo || null,
        video: video || null,
        audio: audio || null,
      },
      shareOptions: {
        facebook: isFacebook,
        instagram: isInstagram,
      },
      timestamp: new Date().toISOString(),
    };

    console.log("Post payload ready for API:", payload);

    /**
     * TODO: Replace console.log with your API call
     * Example:
     * await fetch("https://your-api-endpoint.com/posts", {
     *   method: "POST",
     *   headers: { "Content-Type": "application/json" },
     *   body: JSON.stringify(payload),
     * });
     */

    // Optional: trigger social share
    if (isFacebook && photo) await shareToFacebook(photo);
    if (isInstagram && photo) await shareToInstagram(photo);

    // Reset state after post
    setPhoto(null);
    setVideo(null);
    setAudio(null);
    setIsFacebook(false);
    setIsInstagram(false);

    router.back();
  };

  return (
    <GradientBackground>
      <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
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
            <TouchableOpacity
              onPress={handleCreatePost}
              className="px-4 py-2 rounded-full bg-primary"
            >
              <Text className="font-roboto-semibold">Post</Text>
            </TouchableOpacity>
          </View>

          {/* border */}
          <View className="border-b border-[#292929] w-full mt-2"></View>

          {/* scroll view */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 72, marginHorizontal: 24 }}
          >
            {/* Media Preview */}
            <View className="items-center mt-11">
              {photo ? (
                <Image
                  source={{ uri: photo }}
                  style={{ width: 300, height: 300, borderRadius: 12 }}
                  contentFit="cover"
                />
              ) : video ? (
                <Video
                  ref={videoRef}
                  style={{ width: 300, height: 300, borderRadius: 12 }}
                  //@ts-ignore
                  src={video}
                  useNativeControls
                  resizeMode={ResizeMode.COVER}
                  isMuted={false}
                  shouldPlay
                  isLooping
                />
              ) : audio ? (
                <View className="p-6 bg-[#292929] rounded-lg">
                  <Feather name="music" size={64} color="#F54900" />
                  <Text className="text-white mt-2 text-center">Audio Selected</Text>
                </View>
              ) : (
                <>
                  <Feather name="upload" size={80} color="#6B7280" />
                  <Text className="text-primary mt-6 font-roboto-regular text-xl">
                    Choose content type
                  </Text>
                </>
              )}
            </View>

            {/* Upload type selection */}
            <View className="flex-row justify-center items-center gap-6 mt-11">
              <TouchableOpacity
                onPress={pickPhoto}
                className="bg-[#FFFFFF0D] px-5 py-4 rounded-lg"
              >
                <Foundation name="photo" size={40} color="#9810FA" />
                <Text className="text-primary font-roboto-regular mt-1">Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={pickVideo}
                className="bg-[#FFFFFF0D] px-5 py-4 rounded-lg"
              >
                <Feather name="video" size={40} color="#E60076" />
                <Text className="text-primary font-roboto-regular mt-1">Video</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={pickAudio}
                className="bg-[#FFFFFF0D] px-5 py-4 rounded-lg"
              >
                <Feather name="music" size={40} color="#F54900" />
                <Text className="text-primary font-roboto-regular mt-1">Music</Text>
              </TouchableOpacity>
            </View>

            {/* Share Options */}
            <View className="p-4 bg-[#FFFFFF0D] rounded-lg mt-7 flex-row justify-between items-center">
              <View className="flex-row gap-3 items-center">
                <Feather name="facebook" size={24} color="white" />
                <Text className="text-primary">Share with Facebook</Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsFacebook(!isFacebook)}
                className="w-6 h-6 rounded-full border-[1.5px] border-white flex-row justify-center items-center"
              >
                {isFacebook ? (
                  <View className="w-3.5 h-3.5 bg-blue-500 rounded-full" />
                ) : (
                  <View className="w-3.5 h-3.5 bg-white rounded-full" />
                )}
              </TouchableOpacity>
            </View>

            <View className="p-4 bg-[#FFFFFF0D] rounded-lg mt-7 flex-row justify-between items-center">
              <View className="flex-row gap-3 items-center">
                <SimpleLineIcons name="social-instagram" size={24} color="white" />
                <Text className="text-primary">Share with Instagram</Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsInstagram(!isInstagram)}
                className="w-6 h-6 rounded-full border-[1.5px] border-white flex-row justify-center items-center"
              >
                {isInstagram ? (
                  <View className="w-3.5 h-3.5 bg-blue-500 rounded-full" />
                ) : (
                  <View className="w-3.5 h-3.5 bg-white rounded-full" />
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default CreatePost;
