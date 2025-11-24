import BackButton from "@/components/button/BackButton";
import ShadowButton from "@/components/button/ShadowButton";
import Input from "@/components/inpute/Inpute";
import GradientBackground from "@/components/main/GradientBackground";
import { router } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ResetPassword = () => {
  return (
    <GradientBackground>
      <SafeAreaView
        className="flex-1 mx-6 mt-2.5"
        edges={["top", "bottom", "left", "right"]}
      >
        {/* back button */}
        <BackButton />

        {/* welcome text */}
        <View>
          <Text className="text-[#E6E6E6] text-2xl font-roboto-semibold mt-6 text-center">
            Set a new password
          </Text>
          <Text className="font-roboto-medium text-secondary text-sm text-center mt-1.5 ">
            Enter & confirm your new password
          </Text>
        </View>

        {/* emain input */}
        <View className=" p-6 bg-[#FFFFFF0D] rounded-3xl mt-6">
          <Input
            title="New Password"
            placeholder="Enter new password"
            className="mt-4"
            isPassword={true}
          />
          <Input
            title="Confirm Password"
            placeholder="Confirm new password"
            className="mt-4"
            isPassword={true}
          />

          {/* Back to Login button */}
          <ShadowButton
            text="Update Password"
            textColor="#2B2B2B"
            backGroundColor="#E8EBEE"
            onPress={() => router.push("/(auth)/login")}
            className="mt-4"
          />
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default ResetPassword;
