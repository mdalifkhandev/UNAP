import BackButton from "@/components/button/BackButton";
import ShadowButton from "@/components/button/ShadowButton";
import GradientCard from "@/components/card/GradientCard";
import Inpute from "@/components/inpute/Inpute";
import GradientBackground from "@/components/main/GradientBackground";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ForgetPassword = () => {
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
            Forget Password
          </Text>
          <Text className="font-roboto-medium text-secondary text-sm text-center mt-1.5 ">
            Enter your email address and we’ll send you a code to {"\n"} reset
            your password
          </Text>
        </View>

        {/* emain input */}
        <GradientCard>
          <Inpute
            title="Email"
            placeholder="example@example.com"
            className="mt-4"
          />

          {/* Back to Login button */}
          <ShadowButton
            text="Send Reset Code"
            textColor="#2B2B2B"
            backGroundColor="#E8EBEE"
            onPress={() => router.push("/screens/auth/otp-verify")}
            className="mt-4"
          />

          <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
            <Text className="text-center text-primary font-roboto-regular text-sm mt-4">
              Back to Login
            </Text>
          </TouchableOpacity>
        </GradientCard>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default ForgetPassword;
