import ShadowButton from "@/components/button/ShadowButton";
import GradientBackground from "@/components/main/GradientBackground";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const WelcomeScreen = () => {
  return (
    <GradientBackground>
      <SafeAreaView
        edges={["top", "bottom", "left", "right"]}
        className="p-6 flex-1 justify-center"
      >
        <Image
          source={require("@/assets/images/logo.png")}
          style={{ width: "100%", height: 130 }}
          contentFit="contain"
        />

        {/* welcome message */}
        <View className="mt-8 my-10 items-center">
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
        <View className="my-6">
          <ShadowButton
            text="Get Started"
            textColor="#2B2B2B"
            backGroundColor="#E8EBEE"
            onPress={() => router.push("/(auth)/login")}
          />

          <TouchableOpacity
            onPress={() => router.push("/screens/auth/notice")}
            className="p-3 bg-[#00000066] rounded-full mt-3 border border-[#FFFFFF1A]"
          >
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
