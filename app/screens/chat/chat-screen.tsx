import BackButton from "@/components/button/BackButton";
import GradientBackground from "@/components/main/GradientBackground";
import ChatSettings from "@/components/modal/ChatSettings";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const messages = [
  {
    id: "1",
    type: "receive",
    text: "Hi! How are you doing today? Did you get a chance to check the new design I sent you yesterday?",
    time: "09:10 AM",
  },
  {
    id: "2",
    type: "send",
    text: "Hey! I'm good, thanks for asking. Yes, I looked at the design. It looks really clean and modern!",
    time: "09:12 AM",
  },
  {
    id: "3",
    type: "receive",
    text: "Glad to hear that! I was thinking we could also try a few alternative color palettes to see which one fits better for the mobile app layout.",
    time: "09:15 AM",
  },
  {
    id: "4",
    type: "send",
    text: "Absolutely, I agree. Maybe we can schedule a quick call this afternoon to finalize the color choices?",
    time: "09:17 AM",
  },
  {
    id: "5",
    type: "receive",
    text: "Sounds perfect! I will prepare the alternative palettes and send them to you before the call. Looking forward to it.",
    time: "09:20 AM",
  },
  {
    id: "6",
    type: "send",
    text: "Great! Thanks. Also, I started working on the backend integration for the new feature, so we can review both frontend and backend together.",
    time: "09:25 AM",
  },
  {
    id: "7",
    type: "receive",
    text: "That's amazing! I was worried about the timeline, but if we can review both together, it will save a lot of time.",
    time: "09:30 AM",
  },
  {
    id: "8",
    type: "send",
    text: "Exactly. After the call, I will update the documentation and share it with the team. This way, everyone stays in sync.",
    time: "09:35 AM",
  },
];

const ChatScreen = () => {
  const flatRef = useRef(null);

  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      //@ts-ignore
      flatRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  //@ts-ignore
  const renderMessage = ({ item }) => {
    const isSender = item.type === "send";

    if (isSender) {
      // Sender Bubble
      return (
        <View className="flex-row justify-end mb-4 px-4 mt-8">
          <View className="bg-[#FFFFFF0D] border border-[#FFFFFF0D] rounded-[10px] w-[75%] py-2.5 px-3">
            <Text className="font-roboto-semibold text-primary">
              {item.text}
            </Text>
            <Text className="text-sm font-roboto-regular text-primary mt-3">
              {item.time}
            </Text>
          </View>
        </View>
      );
    } else {
      // Receiver Bubble with Profile
      return (
        <View className="flex-row gap-3 items-end mt-7 px-4">
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/profile")}
            className="mt-2 relative"
          >
            <Image
              source={require("@/assets/images/profile.png")}
              style={{
                width: 40,
                height: 40,
                borderRadius: 100,
              }}
              contentFit="contain"
            />
            <View className="h-3 w-3 rounded-full bg-[#00B56C] absolute right-0 bottom-0" />
          </TouchableOpacity>

          <View className="bg-primary border border-[#EEEEEE] rounded-[10px] w-[75%] py-2.5 px-3">
            <Text className="font-roboto-semibold text-[#434343]">
              {item.text}
            </Text>
            <Text className="text-sm font-roboto-regular text-[#434343] mt-3">
              {item.time}
            </Text>
          </View>
        </View>
      );
    }
  };

  return (
    <GradientBackground>
      <SafeAreaView className="flex-1  " edges={["top", "left", "right"]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          {/* headers */}
          <View className="flex-row justify-between items-center mx-6 mt-5 mb-2">
            <View className="flex-row items-center gap-5 ">
              <BackButton />
              <TouchableOpacity
                onPress={() => router.push("/(tabs)/profile")}
                className="mt-2 relative"
              >
                <Image
                  source={require("@/assets/images/profile.png")}
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 100,
                  }}
                  contentFit="contain"
                />
                <View className="h-3 w-3 rounded-full bg-[#00B56C] absolute right-0 bottom-0" />
              </TouchableOpacity>
              <View>
                <Text className="text-primary font-roboto-semibold text-xl">
                  Farhan Khan
                </Text>
                <Text className="text-secondary font-roboto-regular mt-1 ">
                  Online
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => setShowMenu(true)}>
              <Entypo name="dots-three-horizontal" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* ======================messages start====================== */}
          <FlatList
            ref={flatRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderMessage}
            contentContainerStyle={{ paddingBottom: 0 }}
            onContentSizeChange={() =>
              //@ts-ignore
              flatRef.current?.scrollToEnd({ animated: true })
            }
            showsVerticalScrollIndicator={false}
          />

          {/* ======================messages end====================== */}

          {/* message input and send button */}

          <View className="flex-row items-center py-4 mx-6 gap-3">
            {/* Plus Button */}
            <TouchableOpacity className="bg-[#ffffff0d] h-12 w-12 rounded-full items-center justify-center border border-[#ffffff1a]">
              <Feather name="plus" size={25} color="white" />
            </TouchableOpacity>

            {/* Text Input Box */}
            <View className="flex-1 bg-[#292929] rounded-3xl flex-row items-center px-4 h-12">
              {/* Text Input */}
              <TextInput
                placeholder="Message..."
                placeholderTextColor="#9ca3af"
                multiline
                className="flex-1 text-white text-[15px]"
              />

              {/* Emoji */}
              <TouchableOpacity className="ml-2">
                <Feather name="smile" size={22} color="#d1d5db" />
              </TouchableOpacity>
            </View>

            {/* Send Button */}
            <TouchableOpacity className="bg-[#ffffff0d] h-12 w-12 rounded-full items-center justify-center border border-[#ffffff1a]">
              <Feather name="send" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
        <ChatSettings showMenu={showMenu} setShowMenu={setShowMenu} />
      </SafeAreaView>
    </GradientBackground>
  );
};

export default ChatScreen;
