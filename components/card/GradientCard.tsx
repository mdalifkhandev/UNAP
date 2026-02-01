import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import useThemeStore from "@/store/theme.store";

const GradientCard = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const { mode } = useThemeStore();
  const isLight = mode === "light";

  return (
    <LinearGradient
      colors={
        isLight ? ["#F0F2F5", "#F0F2F5"] : ["#1E252F", "#0E0F10", "#1E252F"]
      }
      locations={isLight ? [0, 1] : [0, 0.2, 0.8]}
      start={{ x: 0, y: 0 }}
      end={{ x: 3, y: 1 }}
      style={{
        borderRadius: 24,
      }}
      className={`mt-6 p-6 border border-black/20 dark:border-[#FFFFFF0D] rounded-3xl bg-[#F0F2F5] dark:bg-[#FFFFFF0D] ${className} `}
    >
      {children}
    </LinearGradient>
  );
};

export default GradientCard;
