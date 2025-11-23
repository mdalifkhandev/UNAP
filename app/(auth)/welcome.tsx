import ShadowButton from "@/components/button/ShadowButton";
import GradientBackground from "@/components/main/GradientBackground";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const WelcomeScreen = () => {
  return (
    <GradientBackground className="justify-center items-center">
      <SafeAreaView edges={["top", "bottom", "left", "right"]}>
        <Image
          source={require("@/assets/images/logo.png")}
          style={{ width: 350, height: 150 }}
          contentFit="contain"
        />

        {/* welcome message */}
        <View className="mt-8 my-10 px-5 items-center">
          <Text className="text-[#E6E6E6] font-roboto-semibold text-center text-2xl">
            Welcome to
          </Text>
          <Text className="text-[#E6E6E6] font-roboto-semibold text-center text-2xl">
            United Artists of Power app
          </Text>
          <Text className="text-[#E6E6E6] font-roboto-medium text-center text-sm mt-2">
            Where artists unite, share, and rise together.
          </Text>
        </View>

        {/* buttons */}
        <View className="m-6">
          {/* <TouchableOpacity
            onPress={() => router.push("/(auth)/login")}
            // className="p-3 bg-[#E8EBEE] rounded-full "
            className="p-3 bg-[#E8EBEE] rounded-full shadow-2xl shadow-[#ffffff]"
          >
            <Text className="font-roboto-bold text-[#2B2B2B] text-center">
              Get Started
            </Text>
          </TouchableOpacity> */}

          <ShadowButton
            text="Get Started"
            textColor="#2B2B2B"
            backGroundColor="#E8EBEE"
            onPress={() => router.push("/(auth)/login")}
          />

          <TouchableOpacity className="p-3 bg-[#00000066] rounded-full mt-3 border border-[#FFFFFF1A]">
            <Text className="font-roboto-bold text-[#FFFFFF] text-center">
              Create Account
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default WelcomeScreen;
