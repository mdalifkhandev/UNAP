import GradientBackground from "@/components/main/GradientBackground";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import Foundation from "@expo/vector-icons/Foundation";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { Video } from "expo-av";
import * as DocumentPicker from "expo-document-picker";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useNavigation, useRouter } from "expo-router";
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
  // const [sharedToInstagram, setSharedToInstagram] = useState(false);

  const [photo, setPhoto] = useState<string | null>(null);
  const [video, setVideo] = useState<string | null>(null);
  const [audio, setAudio] = useState<string | null>(null);

  const videoRef = useRef<Video>(null);
  const router = useRouter();
  const navigation = useNavigation();

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
        copyToCacheDirectory: true, // Important for file access
      });

      console.log("Audio pick result:", result); // Debug log

      if (result.assets && result.assets.length > 0) {
        const audioUri = result.assets[0].uri;
        setAudio(audioUri);
        setPhoto(null);
        setVideo(null);
        console.log("Audio URI:", audioUri);
      } else {
        console.log("Audio picking canceled");
      }
    } catch (error) {
      console.error("Error picking audio:", error);
    }
  };

  // share on facebook
  //@ts-ignore
  const shareToFacebook = async (fileUri) => {
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

  // share instagram
  //@ts-ignore
  // const shareToInstagram = async (fileUri) => {
  //   if (!(await Sharing.isAvailableAsync())) {
  //     alert("Sharing not available!");
  //     return;
  //   }

  //   await Sharing.shareAsync(fileUri, {
  //     dialogTitle: "Share on Instagram",
  //     UTI: "public.jpeg",
  //     mimeType: "*/*",
  //   });
  // };

  // @ts-ignore
  // const shareToInstagram = async (fileUri) => {
  //   try {
  //     // setSharedToInstagram(true);
  //     // 1. Check sharing availability
  //     const isSharingAvailable = await Sharing.isAvailableAsync();
  //     if (!isSharingAvailable) {
  //       alert("Sharing feature is not available on this device");
  //       return;
  //     }

  //     // 2. Share directly
  //     await Sharing.shareAsync(fileUri, {
  //       dialogTitle: "Share to Instagram Feed",
  //       mimeType: Platform.OS === "ios" ? "public.image" : "image/*",
  //     });

  //     // 3. Auto-return to UNAP posting screen
  //     setTimeout(() => {
  //       const newState = AppState.currentState;
  //       // যদি app active থাকে (user ফিরে এসেছে)
  //       if (newState === "active") {
  //         router.replace("/(tabs)/create");
  //       }
  //     }, 3000);
  //   } catch (error) {
  //     console.error("Instagram sharing failed:", error);
  //     alert("Could not open Instagram. Make sure it's installed.");
  //   }
  // };

  const shareToInstagram = async (fileUri) => {
    try {
      const isSharingAvailable = await Sharing.isAvailableAsync();
      if (!isSharingAvailable) {
        alert("Sharing feature is not available on this device");
        return;
      }

      await Sharing.shareAsync(fileUri, {
        dialogTitle: "Share to Instagram Feed",
        mimeType: Platform.OS === "ios" ? "public.image" : "image/*",
      });

      setTimeout(() => {
        router.replace("/(tabs)/create");
      }, 3000); // 3 seconds
    } catch (error) {
      console.error("Instagram sharing failed:", error);
      alert("Could not open Instagram. Make sure it's installed.");
    }
  };

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
            {/* <View className="items-center mt-11">
              <Feather name="upload" size={80} color="#6B7280" />
              <Text className="text-primary  mt-6 font-roboto-regular text-xl">
                Choose content type
              </Text>
            </View> */}

            <View className="items-center mt-11">
              {photo ? (
                <Image
                  source={{ uri: photo }}
                  style={{
                    width: 300,
                    height: 300,
                    borderRadius: 12,
                  }}
                  contentFit="cover"
                />
              ) : video ? (
                <Video
                  ref={videoRef}
                  style={{ width: 300, height: 300, borderRadius: 12 }}
                  //@ts-ignore
                  src={video}
                  useNativeControls
                  resizeMode="cover"
                  isMuted={false}
                  shouldPlay
                  isLooping
                />
              ) : audio ? (
                <View className="p-6 bg-[#292929] rounded-lg">
                  <Feather name="music" size={64} color="#F54900" />
                  <Text className="text-white mt-2 text-center">
                    Audio Selected
                  </Text>
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

            {/* uplode type icon  */}
            <View className="flex-row justify-center items-center gap-6 mt-11">
              <TouchableOpacity
                onPress={pickPhoto}
                className="bg-[#FFFFFF0D] px-5 py-4 rounded-lg"
              >
                <Foundation name="photo" size={40} color="#9810FA" />
                <Text className="text-primary font-roboto-regular mt-1">
                  Photo
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={pickVideo}
                className="bg-[#FFFFFF0D] px-5 py-4 rounded-lg"
              >
                <Feather name="video" size={40} color="#E60076" />
                <Text className="text-primary font-roboto-regular mt-1">
                  Video
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={pickAudio}
                className="bg-[#FFFFFF0D] px-5 py-4 rounded-lg"
              >
                <Feather name="music" size={40} color="#F54900" />
                <Text className="text-primary font-roboto-regular mt-1">
                  Music
                </Text>
              </TouchableOpacity>
            </View>

            {/* share with */}
            <View className="p-4 bg-[#FFFFFF0D] rounded-lg mt-7 flex-row justify-between items-center">
              <View className="flex-row gap-3 items-center">
                <Feather name="facebook" size={24} color="white" />
                <Text className="text-primary">Share with Facebook</Text>
              </View>
              <TouchableOpacity
                onPress={() => shareToFacebook(photo || video)}
                className="w-6 h-6 rounded-full border-[1.5px] border-white flex-row justify-center items-center"
              >
                {isFacebook && (
                  <View className="w-3.5 h-3.5 bg-blue-500 rounded-full" />
                )}
                {!isFacebook && (
                  <View className="w-3.5 h-3.5 bg-white rounded-full" />
                )}
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
                onPress={() => shareToInstagram(photo || video)}
                className="w-6 h-6 rounded-full border-[1.5px] border-white flex-row justify-center items-center"
              >
                {isInstagram && (
                  <View className="w-3.5 h-3.5 bg-blue-500 rounded-full" />
                )}
                {!isInstagram && (
                  <View className="w-3.5 h-3.5 bg-white rounded-full" />
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
      \
      {/* {sharedToInstagram && (
        <TouchableOpacity
          onPress={() => {
            router.replace("/(tabs)/create");
            setSharedToInstagram(false);
          }}
          className="absolute bottom-6 right-6 bg-[#F54900] px-6 py-3 rounded-full"
        >
          <Text className="text-white font-roboto-semibold">
            Return to UNAP
          </Text>
        </TouchableOpacity>
      )} */}
    </GradientBackground>
  );
};

export default CreatePost;
