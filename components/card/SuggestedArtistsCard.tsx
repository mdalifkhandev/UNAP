import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

const SuggestedArtistsCard = ({ className }: { className?: string }) => {
  const suggestedPrifile = [
    {
      id: "1",
      name: "Ava Martinez",
      profession: "Digital Artist",
      image: {
        uri: "https://demo-source.imgix.net/head_shot.jpg",
      },
    },
    {
      id: "2",
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
    {
      name: "Sophia Chen",
      profession: "Dancer",
      image: {
        uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      },
    },
    {
      name: "Ethan Parker",
      profession: "Graphic Designer",
      image: {
        uri: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
      },
    },
    {
      name: "Isabella Wong",
      profession: "Fashion Model",
      image: {
        uri: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
      },
    },
    {
      name: "Lucas Silva",
      profession: "Videographer",
      image: {
        uri: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
      },
    },
    {
      name: "Emma Johnson",
      profession: "Makeup Artist",
      image: {
        uri: "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
      },
    },
    {
      name: "Oliver Smith",
      profession: "DJ",
      image: {
        uri: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6",
      },
    },
  ];

  return (
    <View
      className={`bg-[#FFFFFF0D] rounded-3xl ${className} border border-[#FFFFFF0D]`}
    >
      <Text className="text-primary font-roboto-bold text-xl px-4 pt-4">
        Suggested Artists
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingVertical: 24,
          gap: 16,
        }}
      >
        {suggestedPrifile.map((item, index) => (
          <TouchableOpacity
            onPress={() =>
              item.id ?
              router.push({
                pathname: "/screens/profile/other-profile",
                params: { id: item.id },
              }) : router.push("/(tabs)/profile")
            }
            key={index}
            className="items-center"
            style={{ width: 80 }}
          >
            <Image
              source={{ uri: item.image.uri }}
              style={{
                width: 60,
                height: 60,
                borderRadius: 100,
              }}
              contentFit="cover"
            />
            <Text
              className="font-roboto-semibold text-sm text-primary mt-2 text-center"
              numberOfLines={1}
            >
              {item.name}
            </Text>
            <Text
              className="font-roboto-regular text-xs text-secondary mt-0.5 text-center"
              numberOfLines={1}
            >
              {item.profession}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default SuggestedArtistsCard;
