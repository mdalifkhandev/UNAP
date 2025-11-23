import GradientBackground from "@/components/main/GradientBackground";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useEffect } from "react";

const SplashScreen = () => {
  // replesh to welcome screen after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/screens/auth/welcome");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <GradientBackground className="justify-center items-center">
      <Image
        source={require("@/assets/images/logo.png")}
        style={{ width: 350, height: 150 }}
        contentFit="contain"
      />
    </GradientBackground>
  );
};

export default SplashScreen;
