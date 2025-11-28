import GradientBackground from "@/components/main/GradientBackground";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const users = [
  {
    id: 1,
    name: "Mikey Mahmud",
    username: "@mikey",
    image: require("@/assets/images/profile.png"),
  },
  {
    id: 2,
    name: "Sarah Mehra",
    username: "@sarah",
    image: require("@/assets/images/profile.png"),
  },
];

const SearchScreen = () => {
  return (
    <GradientBackground>
      <SafeAreaView className="flex-1 mt-2.5" edges={["top", "left", "right"]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          {/* Search bar */}
          <View className="px-5 my-5">
            <View className="flex-row items-center bg-[#1E293B] rounded-2xl px-4 py-1">
              <Ionicons name="search" size={20} color="#94A3B8" />
              <TextInput
                placeholder="Search users"
                placeholderTextColor="#94A3B8"
                className="text-white ml-3 flex-1"
              />
            </View>
          </View>

          {/* User List */}
          <FlatList
            data={users}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity className="flex-row items-center px-5 py-3">
                <Image
                  source={item.image}
                  style={{ width: 45, height: 45, borderRadius: 12 }}
                />

                <View className="ml-4">
                  <Text className="text-white font-semibold">{item.name}</Text>
                  <Text className="text-gray-400">{item.username}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default SearchScreen;
