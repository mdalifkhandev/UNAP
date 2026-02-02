import { useGetUCutsFeed } from '@/hooks/app/ucuts';
import useThemeStore from '@/store/theme.store';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
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
import { useVideoPlayer, VideoView } from 'expo-video';

const { width, height } = Dimensions.get('window');

const StoryItem = ({ item }: { item: any }) => {
  const { mode } = useThemeStore();
  const isLight = mode === 'light';
  const [comment, setComment] = useState('');
  const reaction = '🔥';
  const player = useVideoPlayer(
    item.mediaType === 'video' ? item.storyImage : '',
    mediaTypePlayer => {
      if (item.mediaType === 'video') {
        mediaTypePlayer.loop = true;
        mediaTypePlayer.play();
      }
    }
  );

  return (
    <View style={styles.storyContainer}>
      {item.mediaType === 'video' ? (
        <VideoView
          style={styles.storyImage}
          player={player}
          fullscreenOptions={{ enable: true }}
          allowsPictureInPicture
        />
      ) : (
        <Image
          source={{ uri: item.storyImage }}
          style={styles.storyImage}
          contentFit='cover'
        />
      )}

      <View style={styles.overlay} />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Image
              source={{ uri: item.avatar }}
              style={styles.avatar}
              contentFit='cover'
            />
            <View>
              <Text style={styles.userName}>{item.user}</Text>
              <Text style={styles.timeText}>Just now</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.closeButton}
          >
            <Ionicons
              name='close'
              size={28}
              color={
                isLight ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.6)'
              }
            />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          {item.text ? (
            <Text style={styles.captionText} numberOfLines={2}>
              {item.text}
            </Text>
          ) : null}
          <TouchableOpacity style={styles.reactionItem}>
            <Text style={styles.emoji}>{reaction}</Text>
          </TouchableOpacity>

          <View style={styles.commentInputContainer}>
            <TextInput
              style={styles.input}
              placeholder='Send message'
              placeholderTextColor='#BBBBBB'
              value={comment}
              onChangeText={setComment}
            />
            <TouchableOpacity style={styles.sendButton}>
              <Ionicons
                name='send'
                size={20}
                color={isLight ? 'black' : 'white'}
              />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const StoryView = () => {
  const { ownerId } = useLocalSearchParams<{ ownerId?: string }>();
  const { data } = useGetUCutsFeed();
  const ucuts = data?.ucuts ?? [];

  const segments = useMemo(() => {
    const groups = new Map<
      string,
      {
        ownerId: string;
        ownerName: string;
        ownerAvatar: string;
        latestAt: number;
        items: any[];
      }
    >();

    ucuts.forEach((ucut: any) => {
      const owner = ucut?.owner || {};
      const id = owner?.id || ucut?.userId;
      if (!id) return;
      const createdAt = new Date(ucut?.createdAt || 0).getTime();
      const existing = groups.get(id);
      const ownerName = owner?.name || 'User';
      const ownerAvatar =
        owner?.profileImageUrl || 'https://via.placeholder.com/150';

      if (!existing) {
        groups.set(id, {
          ownerId: id,
          ownerName,
          ownerAvatar,
          latestAt: createdAt,
          items: [ucut],
        });
      } else {
        existing.items.push(ucut);
        if (createdAt > existing.latestAt) {
          existing.latestAt = createdAt;
        }
      }
    });

    const orderedGroups = Array.from(groups.values()).sort(
      (a, b) => b.latestAt - a.latestAt
    );

    return orderedGroups.flatMap(group => {
      const orderedUCuts = [...group.items].sort((a: any, b: any) => {
        const aTime = new Date(a?.createdAt || 0).getTime();
        const bTime = new Date(b?.createdAt || 0).getTime();
        return aTime - bTime;
      });

      return orderedUCuts.flatMap((ucut: any) => {
        const segs = [...(ucut.segments || [])].sort(
          (a: any, b: any) => (a.order || 0) - (b.order || 0)
        );
        return segs.map((seg: any) => ({
          id: `${ucut._id}-${seg.order}`,
          ownerId: group.ownerId,
          user: group.ownerName,
          avatar: group.ownerAvatar,
          storyImage: seg.url,
          mediaType: ucut.mediaType || ucut.type || 'image',
          text: ucut.text || '',
        }));
      });
    });
  }, [ucuts]);

  const startIndex = useMemo(() => {
    if (!ownerId) return 0;
    const idx = segments.findIndex(item => item.ownerId === ownerId);
    return idx >= 0 ? idx : 0;
  }, [ownerId, segments]);

  return (
    <View style={styles.container}>
      <FlatList
        data={segments}
        renderItem={({ item }) => <StoryItem item={item} />}
        keyExtractor={item => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={startIndex}
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  captionText: {
    color: 'white',
    fontSize: 13,
    maxWidth: '55%',
    marginRight: 8,
  },
  reactionItem: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    width: 44,
    height: 44,
    borderRadius: 22,
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
    flex: 1,
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
