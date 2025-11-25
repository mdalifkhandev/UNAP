import BackButton from "@/components/button/BackButton";
import MessageReceiverCard from "@/components/card/MessageReceiverCard";
import MessageSendCard from "@/components/card/MessageSendCard";
import GradientBackground from "@/components/main/GradientBackground";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import { Image } from "expo-image";
import React, { useRef } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ChatScreen = () => {
  const scrollRef = useRef(null);

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
              <TouchableOpacity className="mt-2 relative">
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
            <TouchableOpacity>
              <Entypo name="dots-three-horizontal" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <ScrollView
            ref={scrollRef}
            className="flex-1"
            onContentSizeChange={() =>
              //@ts-ignore
              scrollRef.current?.scrollToEnd({ animated: true })
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 50 }}
          >
            {/* chat */}
            <View className="flex-1 mx-6 ">
              {/* receiverd message */}
              <MessageReceiverCard />
              <MessageSendCard />
              <MessageReceiverCard />
              <MessageSendCard />
              <MessageReceiverCard />
              <MessageSendCard />
              <MessageReceiverCard />
              <MessageSendCard />
            </View>
          </ScrollView>

          {/* message input and send button */}

          <View className="flex-row items-center pb-8 mx-6 gap-3">
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
      </SafeAreaView>
    </GradientBackground>
  );
};

export default ChatScreen;
