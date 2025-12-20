import BackButton from "@/components/button/BackButton";
import ShadowButton from "@/components/button/ShadowButton";
import GradientBackground from "@/components/main/GradientBackground";
import { useUserForgatePasswordVerifyOtp } from "@/hooks/app/auth";
import useAuthStore from "@/store/auth.store";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const OTPVerification = () => {
  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const { email, setResetToken, resetToken } = useAuthStore((state) => state);
  const { mutate } = useUserForgatePasswordVerifyOtp();

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    // Handle backspace
    if (key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleForgatePasswordVerifyOtp = () => {
    const otpString = otp.join("");
    const otpNumber = Number(otpString);
    const data = {
      email,
      otp: otpNumber,
    };
    mutate(data, {
      onSuccess: (res) => {
        console.log(res);
        //@ts-ignore
        setResetToken(res.resetToken);
        router.push("/screens/auth/reset-password");
      },
      onError: (err) => {
        console.log(err);
        alert("Error");
      },
    });
  };

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
            OTP Verification
          </Text>
          <Text className="font-roboto-medium text-secondary text-sm text-center mt-1.5 ">
            Enter the otp sent to your email address to reset your {"\n"}
            password ssd
          </Text>
        </View>

        {/* emain input */}
        <View className=" p-6 bg-[#FFFFFF0D] rounded-3xl mt-6">
          <View className="flex-row justify-between px-2">
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                //@ts-ignore
                ref={(ref) => (inputRefs.current[index] = ref)}
                className={`w-10 h-10 border rounded-[10px] text-sm pb-2 ${
                  digit
                    ? "border-gray-300 bg-white"
                    : "border-[#EEEEEE] bg-white"
                }`}
                style={{ textAlign: "center" }}
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={({ nativeEvent }) =>
                  handleKeyPress(nativeEvent.key, index)
                }
                keyboardType="numeric"
                maxLength={1}
                selectTextOnFocus
              />
            ))}
          </View>

          {/* Back to Login button */}
          <ShadowButton
            text="Verify OTP"
            textColor="#2B2B2B"
            backGroundColor="#E8EBEE"
            onPress={handleForgatePasswordVerifyOtp}
            className="mt-4"
          />

          <TouchableOpacity onPress={() => {}}>
            <Text className="text-center text-primary font-roboto-regular text-sm mt-4">
              Resend OTP
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
            <Text className="text-center text-primary font-roboto-regular text-sm mt-4">
              Back to Login
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default OTPVerification;
