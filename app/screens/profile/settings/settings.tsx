import BackButton from "@/components/button/BackButton";
import GradientBackground from "@/components/main/GradientBackground";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Settings = () => {
  return (
    <GradientBackground>
      <SafeAreaView className="flex-1 mt-2.5" edges={["top", "left", "right"]}>
        <View className="flex-row mt-4 mx-6">
          <BackButton />
          <Text className="text-primary font-roboto-bold text-2xl text-center flex-1">
            Setting
          </Text>
        </View>
        <View className="border-b border-[#292929] w-full mt-2"></View>
        <ScrollView className="mx-6 mt-10" showsVerticalScrollIndicator={false}>
          {/* account info */}
          <View className="bg-[#FFFFFF0D] p-3 rounded-xl">
            <Text className="mx-3 mt-3 text-primary font-roboto-semibold text-xl">
              Account Information
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/screens/profile/edit-profile")}
              className="flex-row justify-between items-center mt-6"
            >
              <View className="flex-row gap-2">
                {/* <View> */}
                <Image
                  source={require("@/assets/images/edit-user.svg")}
                  contentFit="contain"
                  style={{ height: 24, width: 24, marginTop: 10 }}
                />
                {/* </View> */}
                <Text className="mx-3 mt-3 text-primary font-roboto-regular text-lg">
                  Edit Profile
                </Text>
              </View>
              <Entypo
                name="chevron-small-right"
                className="mt-3.5"
                size={26}
                color="white"
              />
            </TouchableOpacity>
          </View>

          {/* Policy Center */}
          <View className="bg-[#FFFFFF0D] p-3 rounded-xl mt-4">
            <Text className="mx-3 mt-3 text-primary font-roboto-semibold text-xl">
              Policy Center
            </Text>

            {/* Privacy Policy */}
            <TouchableOpacity className="flex-row justify-between items-center mt-6">
              <View className="flex-row gap-2">
                {/* <View> */}
                <Ionicons
                  name="shield-checkmark-outline"
                  size={24}
                  className="mt-3"
                  color="white"
                />
                {/* </View> */}
                <Text className="mx-3 mt-3 text-primary font-roboto-regular text-lg">
                  Privacy Policy
                </Text>
              </View>
              <Entypo
                name="chevron-small-right"
                className="mt-3.5"
                size={26}
                color="white"
              />
            </TouchableOpacity>

            {/* Terms & Condition */}
            <TouchableOpacity className="flex-row justify-between items-center mt-4">
              <View className="flex-row gap-2">
                {/* <View> */}
                <Image
                  source={require("@/assets/images/term.svg")}
                  contentFit="contain"
                  style={{ height: 24, width: 24, marginTop: 8 }}
                />
                {/* </View> */}
                <Text className="mx-3 mt-3 text-primary font-roboto-regular text-lg">
                  Terms & Condition
                </Text>
              </View>
              <Entypo
                name="chevron-small-right"
                className="mt-3.5"
                size={26}
                color="white"
              />
            </TouchableOpacity>
          </View>
          {/* Settings */}
          <View className="bg-[#FFFFFF0D] p-3 rounded-xl mt-4">
            <Text className="mx-3 mt-3 text-primary font-roboto-semibold text-xl">
              Settings
            </Text>

            {/* Notification */}
            <TouchableOpacity className="flex-row justify-between items-center mt-6">
              <View className="flex-row gap-2">
                {/* <View> */}
                <Ionicons
                  name="notifications-outline"
                  size={24}
                  className="mt-3"
                  color="white"
                />
                {/* </View> */}
                <Text className="mx-3 mt-3 text-primary font-roboto-regular text-lg">
                  Notification
                </Text>
              </View>
              <Entypo
                name="chevron-small-right"
                className="mt-3.5"
                size={26}
                color="white"
              />
            </TouchableOpacity>

            {/* Terms & Condition */}
            <TouchableOpacity className="flex-row justify-between items-center mt-4">
              <View className="flex-row gap-2">
                {/* <View> */}
                <Feather
                  name="help-circle"
                  size={24}
                  color="white"
                  className="mt-3"
                />
                {/* </View> */}
                <Text className="mx-3 mt-3 text-primary font-roboto-regular text-lg">
                  Terms & Condition
                </Text>
              </View>
              <Entypo
                name="chevron-small-right"
                className="mt-3.5"
                size={26}
                color="white"
              />
            </TouchableOpacity>
            {/* Log Out */}
            <TouchableOpacity className="flex-row justify-between items-center mt-4">
              <View className="flex-row gap-2">
                {/* <View> */}
                <Image
                  source={require("@/assets/images/logout.svg")}
                  contentFit="contain"
                  style={{ height: 24, width: 24, marginTop: 8 }}
                />
                {/* </View> */}
                <Text className="mx-3 mt-3 text-primary font-roboto-regular text-lg">
                  Log Out
                </Text>
              </View>
              <Entypo
                name="chevron-small-right"
                className="mt-3.5"
                size={26}
                color="white"
              />
            </TouchableOpacity>
            {/* Delete Account */}
            <TouchableOpacity className="flex-row justify-between items-center mt-4">
              <View className="flex-row gap-2">
                {/* <View> */}
                <Ionicons
                  name="trash-outline"
                  size={24}
                  color="white"
                  className="mt-3"
                />
                {/* </View> */}
                <Text className="mx-3 mt-3 text-primary font-roboto-regular text-lg">
                  Delete Account
                </Text>
              </View>
              <Entypo
                name="chevron-small-right"
                className="mt-3.5"
                size={26}
                color="white"
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default Settings;
