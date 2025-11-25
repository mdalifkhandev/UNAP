import GradientBackground from "@/components/main/GradientBackground";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
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

const chatData = [
  {
    name: "Arif Hasan",
    message: "Hey! Are you coming today?",
    time: "09:12 AM",
    read: false,
  },
  {
    name: "Nusrat Jahan",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    message: "I have sent the documents.",
    time: "08:50 AM",
    read: false,
  },
  {
    name: "Mehedi Hossain",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    message: "Got it bro! Thanks!",
    time: "08:12 AM",
    read: false,
  },
  {
    name: "Tania Akter",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    message: "Let’s meet after lunch.",
    time: "Yesterday",
  },
  {
    name: "Sakib Rahman",
    image: "https://randomuser.me/api/portraits/men/76.jpg",
    message: "Can you review my code?",
    time: "Yesterday",
  },
  {
    name: "Maliha Chowdhury",
    image: "https://randomuser.me/api/portraits/women/21.jpg",
    message: "I reached home safely!",
    time: "Monday",
  },
  {
    name: "Farhan Khan",
    image: "https://randomuser.me/api/portraits/men/89.jpg",
    message: "Call me when you're free.",
    time: "Monday",
  },
  {
    name: "Sadia Afreen",
    image: "https://randomuser.me/api/portraits/women/17.jpg",
    message: "We should plan the trip.",
    time: "Sunday",
  },
  {
    name: "Tanvir Ahmed",
    image: "https://randomuser.me/api/portraits/men/56.jpg",
    message: "Bro! Where are you?",
    time: "Sunday",
  },
  {
    name: "Sakib Rahman",
    image: "https://randomuser.me/api/portraits/men/76.jpg",
    message: "Can you review my code?",
    time: "Yesterday",
  },
  {
    name: "Maliha Chowdhury",
    image: "https://randomuser.me/api/portraits/women/21.jpg",
    message: "I reached home safely!",
    time: "Monday",
  },
  {
    name: "Farhan Khan",
    image: "https://randomuser.me/api/portraits/men/89.jpg",
    message: "Call me when you're free.",
    time: "Monday",
  },
  {
    name: "Sadia Afreen",
    image: "https://randomuser.me/api/portraits/women/17.jpg",
    message: "We should plan the trip.",
    time: "Sunday",
  },
  {
    name: "Tanvir Ahmed",
    image: "https://randomuser.me/api/portraits/men/56.jpg",
    message: "Bro! Where are you?",
    time: "Sunday",
  },
];

const ChatsList = () => {
  return (
    <GradientBackground>
      <SafeAreaView className="flex-1  " edges={["top", "left", "right"]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          {/* headers */}
          <View className="mt-3 flex-row items-center mx-6 justify-between">
            <Text className="font-roboto-bold text-primary text-2xl text-center flex-1">
              Chat
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/screens/home/notification")}
            >
              <Ionicons name="notifications-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* search bar */}
          <View className="mx-6 mt-7 h-12 flex-row items-center rounded-2xl bg-white px-4 shadow">
            {/* Search Icon */}
            <Feather name="search" size={18} color="#475569" />

            {/* Input */}
            <TextInput
              placeholder="Search......."
              placeholderTextColor="#6B7280"
              returnKeyType="search"
              className="ml-2 flex-1 text-base text-black"
            />
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* chat list  */}
            <View className="mx-6 mt-6">
              {chatData.map((chat, index) => (
                <View key={index}>
                  <TouchableOpacity className="flex-row justify-between">
                    <View className="flex-row gap-4 items-center">
                      {chat.read === false && (
                        <View className=" bg-[#007AFF] h-2 w-2 rounded-full "></View>
                      )}
                      <TouchableOpacity className="mt-2">
                        <Image
                          source={
                            chat.image
                              ? { uri: chat.image }
                              : require("@/assets/images/profile.png")
                          }
                          style={{
                            width: 46,
                            height: 46,
                            borderRadius: 100,
                          }}
                          contentFit="contain"
                        />
                      </TouchableOpacity>
                      <View className=" w-[65%]">
                        <Text className="text-primary font-roboto-semibold text-xl">
                          {chat.name}
                        </Text>
                        <Text
                          className="text-secondary font-roboto-regular mt-1 "
                          numberOfLines={1}
                        >
                          {chat.message}
                        </Text>
                      </View>
                    </View>
                    <Text className="text-secondary ">{chat.time}</Text>
                  </TouchableOpacity>

                  {/* border */}
                  <View className="border-b border-[#292929] w-full my-3"></View>
                </View>
              ))}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default ChatsList;
