import Entypo from "@expo/vector-icons/Entypo";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

type InputProps = {
  placeholder?: string;
  title?: string;
  className?: string;
  required?: boolean;
  secureTextEntry?: boolean;
  isPassword?: boolean;
  inputStyle?: string;
};

const Input = ({
  placeholder,
  title,
  className,
  required,
  secureTextEntry = false,
  isPassword = false,
  inputStyle,
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={`${className}`}>
      {title && (
        <Text className="text-sm text-secondary font-roboto-regular">
          {title}
          {required && <Text className="text-red-600 text-lg">*</Text>}
        </Text>
      )}

      <LinearGradient
        colors={["#272B34", "#191A1A"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className={`border border-primary/20 rounded-xl px-4 py-1 ${title && "mt-1.5"} ${inputStyle}`}
        style={{ borderRadius: 12 }}
      >
        <View className="flex-row items-center justify-between">
          <TextInput
            className="text-primary font-roboto-regular flex-1"
            placeholder={placeholder}
            placeholderTextColor="#9CA3AF"
            secureTextEntry={isPassword ? !showPassword : secureTextEntry}
          />

          {isPassword && (
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              className="p-2"
            >
              {showPassword ? (
                <Entypo name="eye-with-line" size={20} color="#9CA3AF" />
              ) : (
                <Entypo name="eye" size={20} color="#9CA3AF" />
              )}
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>
    </View>
  );
};

export default Input;
