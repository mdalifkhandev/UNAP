import BackButton from "@/components/button/BackButton";
import ShadowButton from "@/components/button/ShadowButton";
import Inpute from "@/components/inpute/Inpute";
import GradientBackground from "@/components/main/GradientBackground";
import { useUserRegister } from "@/hooks/app/auth";
import useAuthStore from "@/store/auth.store";
import Feather from "@expo/vector-icons/Feather";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Signup = () => {
  const socialIcons = {
    google: require("@/assets/images/google.svg"),
    apple: require("@/assets/images/apple.svg"),
    instagram: require("@/assets/images/instagram.svg"),
  };

  const { setEmail, email } = useAuthStore();

  const [isTerm, setIsTerm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const { mutate, isPaused, error } = useUserRegister();

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const hendleRegister = async () => {
    if (!isTerm) {
      alert("Please accept terms & conditions");
      return;
    }

    if (!formData.email || !formData.password) {
      alert("Email & Password are required");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Password not matched");
      return;
    }
    mutate(formData, {
      onSuccess: (data) => {
        router.push("/screens/auth/signup-otp-verify");
        setEmail(formData.email);
      },
      onError: (error) => {
        console.log(error);
      },
    });
  };
  // const hendleRegister = () => {
  //   router.push("/screens/auth/signup-otp-verify");
  // }

  return (
    <GradientBackground>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <SafeAreaView className="flex-1 mx-6 mt-2.5">
          <BackButton />

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          >
            <View>
              <Text className="text-[#E6E6E6] text-2xl font-roboto-semibold mt-6 text-center">
                Welcome Back!
              </Text>
              <Text className="font-roboto-medium text-secondary text-sm text-center mt-1.5">
                Create your account
              </Text>
            </View>

            <View className="p-6 bg-[#FFFFFF0D] rounded-3xl mt-6">
              <Inpute
                title="Name"
                placeholder="Rokey Mahmud"
                value={formData.name}
                onChangeText={(text) => handleChange("name", text)}
              />

              <Inpute
                type="email-address"
                title="Email"
                placeholder="example@example.com"
                required
                className="mt-4"
                value={formData.email}
                onChangeText={(text) => handleChange("email", text)}
              />

              <Inpute
                title="Phone"
                placeholder="+880 123 123 123"
                type="number-pad"
                className="mt-4"
                value={formData.phoneNumber}
                onChangeText={(text) => handleChange("phoneNumber", text)}
              />

              <Inpute
                title="Password"
                placeholder="********"
                required
                isPassword
                className="mt-4"
                value={formData.password}
                onChangeText={(text) => handleChange("password", text)}
              />

              <Inpute
                title="Confirm Password"
                placeholder="********"
                required
                isPassword
                className="mt-4"
                value={formData.confirmPassword}
                onChangeText={(text) => handleChange("confirmPassword", text)}
              />

              <View className="flex-row gap-2 items-center mt-4">
                <TouchableOpacity
                  onPress={() => setIsTerm(!isTerm)}
                  className={`h-5 w-5 rounded-md items-center justify-center ${isTerm ? "bg-blue-600" : "bg-secondary"
                    }`}
                >
                  {isTerm && <Feather name="check" size={16} color="#ffffff" />}
                </TouchableOpacity>

                <Text className="text-secondary text-sm pr-5">
                  You agree to the{" "}
                  <Text className="font-roboto-semibold underline">
                    Terms of service
                  </Text>{" "}
                  &{" "}
                  <Text className="font-roboto-semibold underline">
                    Privacy policy
                  </Text>
                </Text>
              </View>

              <ShadowButton
                text="Register"
                textColor="#2B2B2B"
                backGroundColor="#E8EBEE"
                onPress={hendleRegister}
                className="mt-4"
              />

              <View className="mt-4 flex-row justify-center">
                <Text className="text-secondary_second text-sm">
                  Already have an account?
                </Text>
                <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
                  <Text className="font-roboto-bold text-secondary_second text-sm">
                    {" "}
                    Log In
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="mt-6">
              <Text className="text-secondary_second text-center">
                Or continue with
              </Text>

              {/* social with login */}
              <View className="mt-6 flex-row gap-6">
                {Object.keys(socialIcons).map((item) => (
                  <TouchableOpacity
                    key={item}
                    className="flex-1 p-3 border border-[#FFFFFF1A] rounded-xl items-center"
                  >
                    <Image
                      source={socialIcons[item as keyof typeof socialIcons]}
                      style={{ width: 24, height: 24 }}
                      contentFit="contain"
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
};

export default Signup;
