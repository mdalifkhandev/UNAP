import { stories } from '@/components/main/StorySection';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
    Dimensions,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const StoryItem = ({ item }: { item: any }) => {
  const [comment, setComment] = useState('');
  const reactions = ['❤️', '🔥', '😂', '😮', '😢', '👏'];

  if (item.isMe) return null; // Or handle "Create Story" view differently

  return (
    <View style={styles.storyContainer}>
      {/* Background Story Image */}
      <Image
        source={{ uri: item.storyImage }}
        style={styles.storyImage}
        contentFit="cover"
      />

      {/* Gradient Overlay for better visibility */}
      <View style={styles.overlay} />

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Image
              source={{ uri: item.avatar }}
              style={styles.avatar}
              contentFit="cover"
            />
            <View>
              <Text style={styles.userName}>{item.user}</Text>
              <Text style={styles.timeText}>Just now</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
            <Ionicons name="close" size={28} color="white" />
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          {/* Reaction Bar */}
          <View style={styles.reactionContainer}>
            {reactions.map((emoji, index) => (
              <TouchableOpacity key={index} style={styles.reactionItem}>
                <Text style={styles.emoji}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Comment input */}
          <View style={styles.commentInputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Send message"
              placeholderTextColor="#BBBBBB"
              value={comment}
              onChangeText={setComment}
            />
            <TouchableOpacity style={styles.sendButton}>
              <Ionicons name="send" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const StoryView = () => {
  const { initialIndex } = useLocalSearchParams<{
    initialIndex: string;
  }>();

  const activeStories = stories.filter(s => !s.isMe);
  const startIndex = parseInt(initialIndex || '0');
  // Adjust index if needed (since we filter out 'isMe')
  const adjustedIndex = Math.max(0, stories[startIndex]?.isMe ? 0 : activeStories.findIndex(s => s.id === stories[startIndex]?.id));

  return (
    <View style={styles.container}>
      <FlatList
        data={activeStories}
        renderItem={({ item }) => <StoryItem item={item} />}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={adjustedIndex >= 0 ? adjustedIndex : 0}
        getItemLayout={(data, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  storyContainer: {
    width: width,
    height: height,
  },
  storyImage: {
    position: 'absolute',
    width: width,
    height: height,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'white',
  },
  userName: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  timeText: {
    color: '#CCCCCC',
    fontSize: 12,
  },
  closeButton: {
    padding: 5,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
  },
  reactionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  reactionItem: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    width: 45,
    height: 45,
    borderRadius: 22.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 24,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 25,
    paddingHorizontal: 20,
    height: 50,
  },
  input: {
    flex: 1,
    color: 'white',
    fontSize: 14,
  },
  sendButton: {
    marginLeft: 10,
  },
});

export default StoryView;
