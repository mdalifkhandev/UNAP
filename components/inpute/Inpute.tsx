import Entypo from "@expo/vector-icons/Entypo";
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
        <Text
          className={`text-sm text-secondary font-roboto-regular ${title && "mb-1.5"}`}
        >
          {title}
          {required && <Text className="text-red-600 text-lg">*</Text>}
        </Text>
      )}

      <View className="flex-row items-center justify-between bg-[#FFFFFF0D] rounded-xl">
        <TextInput
          className="text-primary font-roboto-regular p-4 rounded-xl"
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
    </View>
  );
};

export default Input;
