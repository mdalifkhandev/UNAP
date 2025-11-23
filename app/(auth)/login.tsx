import BackButton from "@/components/button/BackButton";
import ShadowButton from "@/components/button/ShadowButton";
import GradientCard from "@/components/card/GradientCard";
import Inpute from "@/components/inpute/Inpute";
import GradientBackground from "@/components/main/GradientBackground";
import Feather from "@expo/vector-icons/Feather";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Login = () => {
  const [rememberMe, setRememberMe] = useState(false);

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
            Welcome Back!
          </Text>
          <Text className="font-roboto-medium text-secondary text-sm text-center mt-1.5">
            Login to your account
          </Text>
        </View>

        {/* login inpute */}
        <GradientCard>
          <Inpute title="Phone" placeholder="+880 123 123 123" />
          <Inpute
            title="Email"
            placeholder="example@example.com"
            className="mt-4"
            required={true}
          />
          <Inpute
            title="Password"
            placeholder="********"
            className="mt-4"
            required={true}
            isPassword={true}
          />
          <View className="mt-4 flex-row justify-between items-center">
            <View className="flex-row gap-2 items-center">
              <TouchableOpacity
                onPress={() => setRememberMe(!rememberMe)}
                className="h-5 w-5 bg-secondary rounded-md flex-row justify-center items-center"
              >
                {rememberMe && (
                  <Feather name="check" size={16} color="#000000" />
                )}
              </TouchableOpacity>
              <Text className="text-secondary text-sm font-roboto-medium mt-1.5">
                Remember me
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push("/(auth)/forget-password")}
            >
              <Text className="text-[#C8CACC] font-roboto-regular text-sm">
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>

          {/* login button */}
          <ShadowButton
            text="Login"
            textColor="#2B2B2B"
            backGroundColor="#E8EBEE"
            onPress={() => router.push("/(tabs)/home")}
            className="mt-4"
          />

          <View className="mt-4 flex-row justify-center items-center">
            <Text className="text-secondary_second font-roboto-regular text-sm">
              Don't have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
              <Text className="font-roboto-bold text-secondary_second text-sm">
                {" "}
                Register
              </Text>
            </TouchableOpacity>
          </View>
        </GradientCard>

        <View className="mt-6">
          <Text className="text-secondary_second text-center font-roboto-regular">
            Or continue with
          </Text>
          <View className="mt-6 flex-row justify-between items-center gap-6">
            <TouchableOpacity className="border border-[#FFFFFF1A] rounded-xl flex-1 p-3 bg-transparent items-center">
              <Image
                source={require("@/assets/images/google.svg")}
                contentFit="contain"
                style={{ height: 24, width: 24 }}
              />
            </TouchableOpacity>
            <TouchableOpacity className="border border-[#FFFFFF1A] rounded-xl flex-1 p-3 bg-transparent items-center">
              <Image
                source={require("@/assets/images/apple.svg")}
                contentFit="contain"
                style={{ height: 24, width: 24 }}
              />
            </TouchableOpacity>
            <TouchableOpacity className="border border-[#FFFFFF1A] rounded-xl flex-1 p-3 bg-transparent items-center">
              <Image
                source={require("@/assets/images/instagram.svg")}
                contentFit="contain"
                style={{ height: 24, width: 24 }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default Login;
