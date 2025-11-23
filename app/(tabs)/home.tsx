import GradientCard from "@/components/card/GradientCard";
import Input from "@/components/inpute/Inpute";
import GradientBackground from "@/components/main/GradientBackground";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Home = () => {
  return (
    <GradientBackground>
      <SafeAreaView
        className="flex-1 mx-6 mt-2.5"
        edges={["top", "left", "right"]}
      >
        <ScrollView>
          {/* home header */}
          <View className="flex-row justify-between items-center mx-4 mt-3">
            <TouchableOpacity>
              <Image
                source={require("@/assets/images/logo.png")}
                style={{ width: 60, height: 26 }}
                contentFit="contain"
              />
            </TouchableOpacity>
            <View className="flex-row gap-3 items-center">
              <TouchableOpacity>
                <MaterialIcons
                  name="notifications-none"
                  size={24}
                  color="white"
                />
              </TouchableOpacity>
              <TouchableOpacity>
                <Image
                  source={require("@/assets/images/profile.png")}
                  style={{
                    width: 30,
                    height: 30,
                  }}
                  contentFit="contain"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* post card */}
          <GradientCard className="flex-row gap-5 ">
            <TouchableOpacity>
              <Image
                source={require("@/assets/images/profile.png")}
                style={{
                  width: 30,
                  height: 30,
                }}
                contentFit="contain"
              />
            </TouchableOpacity>
            <View className=" flex-1">
              <Input placeholder="What's on your mind?" inputStyle="h-[72px]" />
              <View className="flex-row justify-between mt-5">
                <View className="flex-row gap-6">
                  <TouchableOpacity className="flex-row items-center gap-2">
                    <Feather name="image" size={18} color="white" />
                    <Text className="text-white">Photo</Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="flex-row items-center gap-2">
                    <Feather name="link" size={18} color="white" />
                    <Text className="text-white">Link</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity className="px-4 py-2 bg-primary rounded-xl">
                  <Text className="">Post</Text>
                </TouchableOpacity>
              </View>
            </View>
          </GradientCard>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default Home;
