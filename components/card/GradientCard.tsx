import { LinearGradient } from "expo-linear-gradient";
import React from "react";

const GradientCard = ({ children }: { children: React.ReactNode }) => {
  return (
    <LinearGradient
      colors={["#1E252F", "#0E0F10", "#1E252F"]}
      locations={[0, 0.2, 0.8]}
      start={{ x: 0, y: 0 }}
      end={{ x: 3, y: 1 }}
      style={{
        borderRadius: 24,
      }}
      className="mt-6 p-6 border border-[#FFFFFF1A] rounded-3xl bg-[#FFFFFF0D]"
    >
      {children}
    </LinearGradient>
  );
};

export default GradientCard;
