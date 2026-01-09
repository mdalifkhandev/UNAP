import { useUserFollow, useUserUnFollow } from '@/hooks/app/home';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

// Define the Post interface matching the one in home.tsx
interface Author {
  email: string;
  id: string;
  name: string;
}

interface Profile {
  displayName: string;
  profileImageUrl: string;
  role: string;
  username: string;
}

interface Post {
  _id: string;
  author: Author;
  commentCount: number;
  createdAt: string;
  description: string;
  likeCount: number;
  mediaType: 'image' | 'video';
  mediaUrl: string;
  profile: Profile;
  viewerHasLiked: boolean;
  viewerIsFollowing: boolean;
}

const PostCard = ({
  className,
  img,
  post,
  currentUserId,
}: {
  className?: string;
  img?: any;
  post?: Post;
  currentUserId?: string;
}) => {
  const defaultImage = require('@/assets/images/post.png');
  const [isFollowing, setIsFollowing] = React.useState(
    post?.viewerIsFollowing || false
  );

  // Sync state if prop changes (optional, but good for list updates)
  React.useEffect(() => {
    if (post) setIsFollowing(post.viewerIsFollowing);
  }, [post?.viewerIsFollowing]);

  const { mutate: followUser } = useUserFollow();
  const { mutate: unfollowUser } = useUserUnFollow();

  const handleFollowToggle = () => {
    if (!post?.author.id) return;
    
    if (isFollowing) {
      unfollowUser(post.author.id);
      setIsFollowing(prev => !prev);
    }else{
      followUser({ userId: post.author.id });
      setIsFollowing(prev => !prev);
    }
  };
  console.log(isFollowing);

  // Use post data if provided, otherwise use defaults
  const authorName = post?.profile.displayName || 'Maya Lin';
  const authorProfession = post?.profile.role || 'Painter';
  const authorAvatar =
    post?.profile.profileImageUrl ||
    'https://thelightcommittee.com/wp-content/uploads/elementor/thumbs/studio-business-headshot-of-a-black-man-in-Los-Angeles-r42uipeyz48g590yz1bhrtos4flfu3q2tuzohhy7f4.jpg';
  const postText =
    post?.description ||
    'New abstract series exploring the \n intersection of light and shadow. What do you see? #AbstractArt #Minimalism #BlackAndWhite';
  const postImage = post?.mediaUrl || img;
  // Format timestamp if needed, or just use raw string for now
  const timestamp = post?.createdAt
    ? new Date(post.createdAt).toLocaleDateString()
    : '2h ago';

  // Check if current user is the author
  const isOwner = currentUserId && post?.author?.id === currentUserId;

  return (
    <View className={`bg-[#FFFFFF0D] rounded-3xl ${className}`}>
      {/* post header */}
      <View className='p-4 flex-row justify-between items-center'>
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/profile')}
          className='flex-row gap-3'
        >
          <Image
            source={authorAvatar}
            style={{ width: 40, height: 40, borderRadius: 100 }}
            contentFit='cover'
          />
          <View>
            <Text className='font-roboto-semibold text-sm text-primary'>
              {authorName}
            </Text>
            <Text className='font-roboto-regular text-sm text-secondary'>
              {authorProfession}
            </Text>
          </View>
        </TouchableOpacity>

        {!isOwner && (
          <TouchableOpacity
            className={`py-2 px-6 rounded-full items-center justify-center ${isFollowing ? 'bg-transparent border border-secondary/30' : ''}`}
            onPress={handleFollowToggle}
          >
            <Text
              className={`font-roboto-semibold ${isFollowing ? 'text-secondary' : 'text-primary'}`}
            >
              {isFollowing ? 'Unfollow' : 'Follow'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* post image  */}
      {postImage && (
        <Image
          source={postImage}
          style={{
            width: '100%',
            height: 345,
          }}
          contentFit='cover'
        />
      )}

      {/* like comment sheire */}
      <View className='p-3 flex-row justify-between items-center'>
        <View className='flex-row gap-4'>
          <TouchableOpacity>
            <Ionicons name='heart-outline' size={26} color='white' />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name='chatbubble-outline' size={24} color='white' />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name='share-social-outline' size={24} color='white' />
          </TouchableOpacity>
        </View>

        <TouchableOpacity>
          {/* <Feather name="bookmark" size={24} color="white" /> */}
          <Ionicons name='bookmark-outline' size={24} color='white' />
        </TouchableOpacity>
      </View>

      {/* post description */}
      <View className='px-3 pb-3'>
        <Text className='font-roboto-regular text-primary'>{postText}</Text>
        <Text className='font-roboto-semibold text-sm text-secondary mt-2.5'>
          {timestamp}
        </Text>
      </View>
    </View>
  );
};

export default PostCard;
