import BackButton from "@/components/button/BackButton";
import ShadowButton from "@/components/button/ShadowButton";
import Input from "@/components/inpute/Inpute";
import GradientBackground from "@/components/main/GradientBackground";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const EditProfile = () => {
  const [roleOpen, setRoleOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("Singer");

  const roles = ["Singer", "Dancer", "Actor", "Model", "Photographer"];
  return (
    <GradientBackground>
      <SafeAreaView className="flex-1  " edges={["top", "left", "right"]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          {/* headers */}
          <View className="mt-3 flex-row items-center mx-6 justify-between ">
            <BackButton />
            <Text className="font-roboto-bold text-primary text-2xl text-center flex-1">
              Edit profile
            </Text>
          </View>
          {/* border */}
          <View className="border-b border-[#292929] w-full mt-2"></View>

          {/* photo */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            <View className="items-center mt-6">
              <View className="relative">
                {/* Profile Image */}
                <TouchableOpacity>
                  <Image
                    source={{
                      uri: "https://randomuser.me/api/portraits/men/44.jpg",
                    }}
                    style={{ width: 100, height: 100, borderRadius: 100 }}
                    contentFit="cover"
                  />
                </TouchableOpacity>

                {/* Camera Icon - Center Bottom */}
                <View className="absolute top-9 left-9 bg-white h-10 w-10 rounded-full items-center justify-center">
                  <Feather name="camera" size={22} color="black" />
                  <View className="absolute -right-1 -top-1 bg-white h-4 w-4 rounded-full items-center justify-center">
                    <Feather name="plus" size={10} color="black" />
                  </View>
                </View>
              </View>
            </View>
            <Text className="text-primary text-xl font-roboto-semibold text-center mt-3">
              Upload Photo
            </Text>

            {/* inpute fields */}
            <View className="mx-6 mt-6">
              <Text className="text-primary  ">Username</Text>
              <Input className="mt-2" placeholder="@yourhandle" />

              <Text className="text-primary mt-3 ">Display Name</Text>
              <Input className="mt-2" placeholder="Rokey Mahmud" />

              {/* Select Your Role */}
              <Text className="text-primary mb-2 mt-3 text-base">
                Select Your Role
              </Text>

              <View className="w-full">
                <TouchableOpacity
                  onPress={() => setRoleOpen(!roleOpen)}
                  className="w-full bg-[#121212] border border-gray-700 rounded-xl p-4 flex-row justify-between items-center"
                >
                  <Text className="text-gray-200 text-base">
                    {selectedRole}
                  </Text>
                  <Feather
                    name={roleOpen ? "chevron-up" : "chevron-down"}
                    size={20}
                    color="#fff"
                  />
                </TouchableOpacity>

                {roleOpen && (
                  <View className="mt-1 bg-[#121212] rounded-xl border border-gray-700">
                    {roles.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          setSelectedRole(item);
                          setRoleOpen(false);
                        }}
                        className="p-4 border-b border-gray-800"
                      >
                        <Text className="text-gray-200">{item}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Bio */}
              <Text className="text-primary mt-3 mb-2 text-base">Bio</Text>

              <TextInput
                placeholder="Tell us about yourself and your music..."
                placeholderTextColor="#ffffff98"
                multiline
                numberOfLines={4}
                className="bg-[#121212] border border-[#FFFFFF30]  rounded-xl p-4 text-primary"
                style={{ textAlignVertical: "top" }}
              />

              {/* Instagram Title */}
              <Text className="text-primary mt-3 ">Instagram</Text>
              <View className=" rounded-xl px-4 py-3 flex-row items-center border border-[#FFFFFF1A] bg-[#FFFFFF0D] mt-1.5 gap-2">
                <AntDesign name="instagram" size={20} color="#fff" />
                <TextInput
                  placeholder="@username"
                  placeholderTextColor="white"
                  className="flex-1 text-primary"
                />
              </View>

              {/* Youtub Title */}
              <Text className="text-primary mt-3 ">YouTube</Text>
              <View className=" rounded-xl px-4 py-3 flex-row items-center border border-[#FFFFFF1A] bg-[#FFFFFF0D] mt-1.5 gap-2">
                <AntDesign name="youtube" size={20} color="white" />
                <TextInput
                  placeholder="Channel URL"
                  placeholderTextColor="white"
                  className="flex-1 text-primary"
                />
              </View>

              {/* Spotify Title */}
              <Text className="text-primary mt-3 ">Spotify</Text>
              <View className=" rounded-xl px-4 py-3 flex-row items-center border border-[#FFFFFF1A] bg-[#FFFFFF0D] mt-1.5 gap-2">
                <Feather name="music" size={20} color="white" />
                <TextInput
                  placeholder="Artist URL"
                  placeholderTextColor="white"
                  className="flex-1 text-primary"
                />
              </View>
            </View>

            <ShadowButton
              text="Edit Profile"
              textColor="#2B2B2B"
              backGroundColor="#E8EBEE"
              onPress={() => router.push("/")}
              className="mt-8 mx-6 "
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default EditProfile;
