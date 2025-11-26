import React, { useEffect, useRef } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";

export const ToggleButton = ({ isOn, setIsOn, title, className }: any) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isOn ? 1 : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [isOn]);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 26],
  });

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["#6A717E", "#F3F8F4"],
  });

  return (
    <View className={`flex-row items-center gap-4 mb-2 ${className} `}>
      <Text className="text-sm text-[#7A7A7A]">{title ? title : ""}</Text>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setIsOn(!isOn)}
        style={{ width: 50, height: 26 }}
      >
        <Animated.View
          style={{
            flex: 1,
            borderRadius: 77,
            justifyContent: "center",
            paddingHorizontal: 0,
            marginRight: -2,
            backgroundColor,
          }}
        >
          <Animated.View
            style={{
              width: 24,
              height: 24,
              borderRadius: 14,
              backgroundColor: "#100E0E",
              transform: [{ translateX }],
              elevation: 2,
            }}
          />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};
