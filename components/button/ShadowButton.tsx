import React from "react";
import { Text, TouchableOpacity } from "react-native";

const ShadowButton = ({
  onPress,
  textColor,
  backGroundColor,
  text,
  className,
}: {
  onPress?: () => void;
  textColor: string;
  backGroundColor: string;
  text: string;
  className?: string;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`p-3 rounded-full ${className}`}
      style={{
        backgroundColor: backGroundColor,
        shadowColor: "#ffffff",
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: 0.8,
        shadowRadius: 25,
        elevation: 15,
      }}
    >
      <Text
        className="font-roboto-bold  text-center"
        style={{
          color: textColor,
        }}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};

export default ShadowButton;
