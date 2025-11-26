import BackButton from "@/components/button/BackButton";
import NotificationCard from "@/components/card/NotificationCard";
import GradientBackground from "@/components/main/GradientBackground";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const notification = () => {
  const img1 = require("@/assets/images/profile.png");
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
            <NotificationCard
              name=" Sarah Martinez"
              reson=" Liked Your Post"
              time="2 munite ago"
              img={img1}
              className="mt-5"
            />
            <NotificationCard
              name=" Sarah Martinez"
              reson=" Liked Your Post"
              time="2 munite ago"
              img={img1}
              className="mt-3"
            />
            <NotificationCard
              name=" Sarah Martinez"
              reson=" Liked Your Post"
              time="2 munite ago"
              img={img1}
              className="mt-3"
            />
            <NotificationCard
              name=" Sarah Martinez"
              reson=" Liked Your Post"
              time="2 munite ago"
              img={img1}
              className="mt-5"
            />
            <NotificationCard
              name=" Sarah Martinez"
              reson=" Liked Your Post"
              time="2 munite ago"
              img={img1}
              className="mt-3"
            />
            <NotificationCard
              name=" Sarah Martinez"
              reson=" Liked Your Post"
              time="2 munite ago"
              img={img1}
              className="mt-3"
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default notification;
