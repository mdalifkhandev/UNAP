import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const SuggestedArtistsCard = ({ className }: { className?: string }) => {
  const suggestedPrifile = [
    {
      name: "Ava Martinez",
      profession: "Digital Artist",
      image: {
        uri: "https://demo-source.imgix.net/head_shot.jpg",
      },
    },
    {
      name: "Liam Anderson",
      profession: "Fitness Trainer",
      image: {
        uri: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
      },
    },
    {
      name: "Mia Rodriguez",
      profession: "Photographer",
      image: {
        uri: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
      },
    },
    {
      name: "Noah Bennett",
      profession: "Music Producer",
      image: {
        uri: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
      },
    },
  ];

  return (
    <View
      className={`bg-[#FFFFFF0D] rounded-3xl ${className} p-4 border border-[#FFFFFF0D]`}
    >
      <Text className="text-primary font-roboto-bold text-xl">
        Suggested Artists
      </Text>
      <View className="flex-row justify-between mt-6">
        {suggestedPrifile.map((item, index) => (
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/profile")}
            key={index}
            className="items-center"
          >
            <Image
              source={{ uri: item.image.uri }}
              style={{
                width: 50,
                height: 50,
                borderRadius: 100,
              }}
              contentFit="cover"
            />
            <Text className="font-roboto-semibold text-sm text-primary mt-1">
              Sophia Chen
            </Text>
            <Text className="font-roboto-regular text-sm text-secondary mt-0.5">
              Dancer
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default SuggestedArtistsCard;
