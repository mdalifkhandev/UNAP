import NotificationCard from "@/components/card/NotificationCard";
import NotificationUpFollowCard from "@/components/card/NotificationUpFollowCard";
import BackButton from "@/components/button/BackButton";
import GradientBackground from "@/components/main/GradientBackground";
import { useTranslateTexts } from "@/hooks/app/translate";
import useLanguageStore from "@/store/language.store";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Notification = () => {
  const img1 = require("@/assets/images/profile.png");
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const { language } = useLanguageStore();
  const { data: t } = useTranslateTexts({
    texts: [
      "Notification",
      "Liked Your Post",
      "started following you",
      "You've reached 10,000 followers! 🎉",
      "2 minute ago",
      "5 minute ago",
      "10 minute ago",
      "15 minute ago",
      "20 minute ago",
    ],
    targetLang: language,
    enabled: !!language && language !== "EN",
  });
  const tx = (i: number, fallback: string) =>
    t?.translations?.[i] || fallback;

  const handleMenuToggle = (id: string) => {
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  const handleMenuClose = () => {
    setActiveMenuId(null);
  };

  const notifications = [
    {
      id: "1",
      name: "Sarah Martinez",
      reson: tx(1, "Liked Your Post"),
      time: tx(4, "2 minute ago"),
      img: img1,
      type: "like",
    },
    {
      id: "2",
      name: "Sarah Martinez",
      reson: tx(2, "started following you"),
      time: tx(5, "5 minute ago"),
      img: img1,
      type: "follow",
    },
    {
      id: "3",
      name: "Luna Voice",
      reson: tx(3, "You've reached 10,000 followers! 🎉"),
      time: tx(6, "10 minute ago"),
      img: img1,
      type: "10000",
    },
    {
      id: "4",
      name: "Sarah Martinez",
      reson: tx(1, "Liked Your Post"),
      time: tx(7, "15 minute ago"),
      img: img1,
      type: "like",
    },
    {
      id: "5",
      name: "Sarah Martinez",
      reson: tx(1, "Liked Your Post"),
      time: tx(8, "20 minute ago"),
      img: img1,
      type: "like",
    },
  ];

  return (
    <GradientBackground>
      <SafeAreaView className="flex-1 mt-2.5" edges={["top", "left", "right"]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <View className="flex-row mt-4 mx-6">
            <BackButton />
            <Text className="text-primary dark:text-white font-roboto-bold text-2xl text-center flex-1">
              {tx(0, "Notification")}
            </Text>
          </View>

          <View className="border-b border-black/20 dark:border-[#FFFFFF0D] dark:border-[#292929] w-full mt-2" />

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 72, marginHorizontal: 24 }}
            onScrollBeginDrag={handleMenuClose}
          >
            {notifications.map((item) => {
              if (item.type === "10000") {
                return (
                  <NotificationUpFollowCard
                    key={item.id}
                    name={item.name}
                    reson={item.reson}
                    time={item.time}
                    img={item.img}
                    className="mt-3"
                    type={item.type}
                  />
                );
              }

              return (
                <NotificationCard
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  reson={item.reson}
                  time={item.time}
                  img={item.img}
                  className="mt-3"
                  type={item.type as "like" | "follow"}
                  showMenu={activeMenuId === item.id}
                  onMenuToggle={handleMenuToggle}
                  onMenuClose={handleMenuClose}
                />
              );
            })}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default Notification;
