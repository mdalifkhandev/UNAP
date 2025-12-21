import { MaterialCommunityIcons, Octicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

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
}: NotificationCardProps) => {
  const [isRead, setIsRead] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  // Handle mark as read
  const handleMarkAsRead = () => {
    setIsRead(true);
    onMenuClose?.();
  };

  // Handle delete
  const handleDelete = () => {
    setIsDeleted(true);
    onMenuClose?.();
  };

  // Don't render if deleted
  if (isDeleted) {
    return null;
  }

  return (
    <TouchableOpacity onPress={onMenuClose} activeOpacity={1}>
      <View
        className={`bg-[#FFFFFF0D] py-5 px-4 rounded-xl flex-row justify-between gap-5 ${className} ${isRead ? 'opacity-60' : ''}`}
      >
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/profile")}
          className="relative"
        >
          <Image
            source={img}
            style={{ width: 40, height: 40 }}
            contentFit="contain"
          />

          {type === "like" && (
            <View className="absolute right-0 bottom-5">
              <MaterialCommunityIcons
                name="cards-heart"
                size={24}
                color="#F6339A"
              />
            </View>
          )}

          {type === "follow" && (
            <View className="absolute -right-2 bottom-3 bg-white rounded-full p-1">
              <Octicons name="person-add" size={19} color="#2B7FFF" />
            </View>
          )}
        </TouchableOpacity>

        <View className="flex-1">
          <Text className="font-roboto-semibold text-primary text-lg capitalize">
            {name}
          </Text>
          <Text className="font-roboto-regular text-sm text-primary mt-1 capitalize">
            {reson}
          </Text>
          <Text className="font-roboto-regular text-sm text-primary mt-1 capitalize">
            {time}
          </Text>
        </View>

        <TouchableOpacity onPress={() => onMenuToggle?.(id)}>
          <MaterialCommunityIcons name="dots-vertical" size={24} color="white" />
        </TouchableOpacity>

        {/* Dropdown Menu */}
        {showMenu && (
          <View className="absolute right-0 top-12 bg-[#1c1c1d] rounded-lg shadow-lg z-10 min-w-[120px]">
            <TouchableOpacity
              onPress={handleMarkAsRead}
              className="px-4 py-3 flex-row items-center border-b border-gray-600"
            >
              <MaterialCommunityIcons name="check" size={16} color="#10B981" />
              <Text className="text-white ml-2 text-sm">Mark as read</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDelete}
              className="px-4 py-3 flex-row items-center"
            >
              <MaterialCommunityIcons name="delete" size={16} color="#EF4444" />
              <Text className="text-white ml-2 text-sm">Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default NotificationCard;
