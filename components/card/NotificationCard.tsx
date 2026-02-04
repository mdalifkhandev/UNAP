import { MaterialCommunityIcons, Octicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useTranslateTexts } from "@/hooks/app/translate";
import useLanguageStore from "@/store/language.store";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import useThemeStore from "@/store/theme.store";

type NotificationCardProps = {
  img: any;
  name: string;
  reson: string;
  time: string;
  className?: string;
  type?: "like" | "follow" | "10000";
  showMenu?: boolean;
  onMenuToggle?: (id: string) => void;
  onMenuClose?: () => void;
  id: string;
  userId?: string;
};

const NotificationCard = ({
  img,
  name,
  reson,
  time,
  className,
  type,
  showMenu = false,
  onMenuToggle,
  onMenuClose,
  id,
  userId,
}: NotificationCardProps) => {
  const [isRead, setIsRead] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const { mode } = useThemeStore();
  const isLight = mode === "light";
  const { language } = useLanguageStore();
  const { data: t } = useTranslateTexts({
    texts: ["Mark as read", "Delete"],
    targetLang: language,
    enabled: !!language && language !== "EN",
  });
  const tx = (i: number, fallback: string) =>
    t?.translations?.[i] || fallback;

  const handleMarkAsRead = () => {
    setIsRead(true);
    onMenuClose?.();
  };

  const handleDelete = () => {
    setIsDeleted(true);
    onMenuClose?.();
  };

  if (isDeleted) {
    return null;
  }

  return (
    <View
      className={`bg-[#F0F2F5] dark:bg-[#FFFFFF0D] py-5 px-4 rounded-xl flex-row justify-between gap-5 ${className} ${
        isRead ? "opacity-60" : ""
      }`}
    >
      <TouchableOpacity
        onPress={() => {
          if (userId) {
            router.push({
              pathname: "/screens/profile/other-profile",
              params: { id: userId },
            });
          } else {
            router.push("/(tabs)/profile");
          }
        }}
        className="relative"
      >
        <Image source={img} style={{ width: 40, height: 40 }} contentFit="contain" />

        {type === "like" && (
          <View className="absolute right-0 bottom-5">
            <MaterialCommunityIcons name="cards-heart" size={24} color="#F6339A" />
          </View>
        )}

        {type === "follow" && (
          <View className="absolute -right-2 bottom-3 bg-white rounded-full p-1">
            <Octicons name="person-add" size={19} color="#2B7FFF" />
          </View>
        )}
      </TouchableOpacity>

      <View className="flex-1">
        <Text className="font-roboto-semibold text-primary dark:text-white text-lg capitalize">
          {name}
        </Text>
        <Text className="font-roboto-regular text-sm text-primary dark:text-white mt-1 capitalize">
          {reson}
        </Text>
        <Text className="font-roboto-regular text-sm text-primary dark:text-white mt-1 capitalize">
          {time}
        </Text>
      </View>

      <TouchableOpacity onPress={() => onMenuToggle?.(id)}>
        <MaterialCommunityIcons name="dots-vertical" size={24} color={isLight ? "#9CA3AF" : "white"} />
      </TouchableOpacity>

      {showMenu && (
        <View
          className={`absolute right-[35px] top-[20px] rounded-lg shadow-lg z-10 min-w-[200px] ${
            isLight ? "bg-white" : "bg-[#1c1c1d]"
          }`}
        >
          <TouchableOpacity
            onPress={handleMarkAsRead}
            className="px-4 py-3 flex-row items-center border-b border-black/20 dark:border-[#FFFFFF0D] dark:border-gray-600"
          >
            <MaterialCommunityIcons name="check" size={16} color="#10B981" />
            <Text className="text-black dark:text-white ml-2 text-sm">{tx(0, "Mark as read")}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} className="px-4 py-3 flex-row items-center">
            <MaterialCommunityIcons name="delete" size={16} color="#EF4444" />
            <Text className="text-black dark:text-white ml-2 text-sm">{tx(1, "Delete")}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default NotificationCard;
