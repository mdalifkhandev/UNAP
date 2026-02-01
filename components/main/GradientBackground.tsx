import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StatusBar } from "react-native";
import useThemeStore from "@/store/theme.store";

type GradientBackgroundProps = {
  children: React.ReactNode;
  className?: string;
  style?: object;
};

const GradientBackground = ({
  children,
  style,
  className,
}: GradientBackgroundProps) => {
  const { mode } = useThemeStore();
  const isLight = mode === "light";

  return (
    <LinearGradient
      className={`${className || ""} `}
      colors={
        isLight
          ? ["#FFFFFF", "#FFFFFF"]
          : ["#1E293B", "#0B0F15", "#090e12", "#0B0F15", "#1E293B"]
      }
      locations={isLight ? [0, 1] : [0, 0.25, 0.5, 0.75, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1, ...style }}
    >
      <StatusBar
        barStyle={isLight ? "dark-content" : "light-content"}
        backgroundColor={isLight ? "white" : "black"}
      />
      {children}
    </LinearGradient>
  );
};

export default GradientBackground;