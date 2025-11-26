import BackButton from "@/components/button/BackButton";
import { ToggleButton } from "@/components/button/ToggleButton";
import GradientBackground from "@/components/main/GradientBackground";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const NotificationSettings = () => {
  const [isEmailOn, setIsEmailOn] = useState(false);
  const [isSMSOn, setIsSMSOn] = useState(true);
  return (
    <GradientBackground>
      <SafeAreaView className="flex-1 mt-2.5" edges={["top", "left", "right"]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <View className="flex-row mt-4 mx-6">
            <BackButton />
            <Text className="text-primary font-roboto-bold text-2xl text-center flex-1">
              Notification
            </Text>
          </View>
          <View className="border-b border-[#292929] w-full mt-2"></View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 72, marginHorizontal: 24 }}
          >
            <View className="flex-row  justify-between p-3 border border-[#FFFFFF0D] rounded-2xl mt-6 items-center bg-[#FFFFFF0D]">
              <Text className="text-primary font-roboto-semibold">
                Email Notifications
              </Text>
              <ToggleButton isOn={isEmailOn} setIsOn={setIsEmailOn} />
            </View>
            <View className="flex-row  justify-between p-3 border border-[#FFFFFF0D] rounded-2xl mt-3 items-center bg-[#FFFFFF0D]">
              <Text className="text-primary font-roboto-semibold">
                SMS Notifications
              </Text>
              <ToggleButton isOn={isSMSOn} setIsOn={setIsSMSOn} />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default NotificationSettings;
