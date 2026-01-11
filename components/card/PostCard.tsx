import {
  useDeleteComment,
  useUserCreateComment,
  useUserFollow,
  useUserGetComment,
  useUserLike,
  useUserUnFollow,
  useUserUnLike,
} from '@/hooks/app/home';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import React, { useEffect, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

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
  mediaType: 'image' | 'video' | 'audio';
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

  const [isFollowing, setIsFollowing] = useState(
    post?.viewerIsFollowing || false
  );

  const [isLiked, setIsLiked] = useState(post?.viewerHasLiked || false);
  const [likeCount, setLikeCount] = useState(post?.likeCount || 0);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  const { data: commentData } = useUserGetComment(post?._id || '');
  const { mutate: addComment } = useUserCreateComment();
  const { mutate: deleteComment } = useDeleteComment();

  // Video player setup
  const player = useVideoPlayer(post?.mediaUrl || '', player => {
    player.loop = true;
  });

  // Sync state if prop changes (optional, but good for list updates)
  useEffect(() => {
    if (post) {
      setIsFollowing(post.viewerIsFollowing);
      setIsLiked(post.viewerHasLiked);
      setLikeCount(post.likeCount);
    }
  }, [post?.viewerIsFollowing, post?.viewerHasLiked, post?.likeCount]);

  const { mutate: followUser } = useUserFollow();
  const { mutate: unfollowUser } = useUserUnFollow();
  const { mutate: likeUser } = useUserLike();
  const { mutate: unLikeUser } = useUserUnLike();




  const handleLikeToggle = () => {
    if (!post?._id) return;

    if (isLiked) {
      unLikeUser(post._id);
      setIsLiked(false);
      setLikeCount(prev => Math.max(0, prev - 1));
    } else {
      likeUser({ postId: post._id });
      setIsLiked(true);
      setLikeCount(prev => prev + 1);
    }
  };

  const handleFollowToggle = () => {
    if (!post?.author.id) return;

    if (isFollowing) {
      unfollowUser(post.author.id);
      setIsFollowing(prev => !prev);
    } else {
      followUser({ userId: post.author.id });
      setIsFollowing(prev => !prev);
    }
  };

  const handlePostComment = () => {
    if (!commentText.trim() || !post?._id) return;
    addComment({ postId: post._id, text: commentText });
    setCommentText('');
  };

  const handleDeleteComment = (commentId: string) => {
    if (!post?._id) return;
    deleteComment({ commentId, postId: post._id });
  };

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

  const comments = (commentData as any)?.comments || [];

  return (
    <View className={`bg-[#FFFFFF0D] rounded-3xl ${className}`}>
      {/* post header */}
      <View className='p-4 flex-row justify-between items-center'>
        <TouchableOpacity
          onPress={() => {
            if (isOwner) {
              router.push('/(tabs)/profile');
            } else {
              router.push({
                pathname: '/screens/profile/other-profile',
                params: { id: post?.author?.id },
              });
            }
          }}
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

      {/* post media content  */}
      <View>
        {post?.mediaType === 'image' && postImage && (
          <Image
            source={postImage}
            style={{ width: '100%', height: 345 }}
            contentFit='cover'
          />
        )}

        {post?.mediaType === 'video' && post?.mediaUrl && (
          <VideoView
            style={{ width: '100%', height: 345 }}
            player={player}
            fullscreenOptions={{ enable: true }}
            allowsPictureInPicture
          />
        )}

        {post?.mediaType === 'audio' && post?.mediaUrl && (
          <View className='bg-white/5 p-6 rounded-2xl mx-3 items-center flex-row gap-4'>
            <TouchableOpacity
              className='bg-primary/20 p-3 rounded-full'
              onPress={() => {
                if (player.playing) player.pause();
                else player.play();
              }}
            >
              <Ionicons
                name={player.playing ? 'pause' : 'play'}
                size={24}
                color='white'
              />
            </TouchableOpacity>
            <View className='flex-1'>
              <Text className='text-white font-roboto-medium'>Audio Post</Text>
              <Text className='text-secondary text-xs'>
                Click to play/pause
              </Text>
            </View>
            <Ionicons name='musical-note' size={24} color='white' />
          </View>
        )}
      </View>

      {/* like comment share */}
      <View className='p-3 flex-row justify-between items-center'>
        <View className='flex-row gap-4'>
          <TouchableOpacity
            onPress={handleLikeToggle}
            className='flex-row items-center gap-1.5'
          >
            <Ionicons
              name={isLiked ? 'heart' : 'heart-outline'}
              size={26}
              color={`${isLiked ? 'red' : 'white'}`}
            />
            {likeCount > 0 && (
              <Text className='text-white font-roboto-medium'>{likeCount}</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowComments(!showComments)}
            className='flex-row items-center gap-1.5'
          >
            <Ionicons name='chatbubble-outline' size={24} color='white' />
            {post?.commentCount !== undefined && post.commentCount > 0 && (
              <Text className='text-white font-roboto-medium'>
                {post.commentCount}
              </Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name='share-social-outline' size={24} color='white' />
          </TouchableOpacity>
        </View>

        <TouchableOpacity>
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

      {/* expandable comment section */}
      {showComments && (
        <View className='px-3 pb-4 border-t border-white/10 pt-3'>
          {/* Comment Input */}
          <View className='flex-row items-center gap-2 mb-4'>
            <TextInput
              className='flex-1 bg-white/10 text-white p-3 rounded-2xl font-roboto-regular'
              placeholder='Write a comment...'
              placeholderTextColor='#999'
              value={commentText}
              onChangeText={setCommentText}
              multiline
            />
            <TouchableOpacity
              onPress={handlePostComment}
              className='bg-white p-2 rounded-2xl h-[35px] justify-center items-center'
              disabled={!commentText.trim()}
            >
              <Ionicons name='send' size={16} color='black' />
            </TouchableOpacity>
          </View>

          {/* Comments List */}
          {comments.length > 0 ? (
            comments.map((comment: any) => (
              <View key={comment._id} className='mb-4'>
                <View className='flex-row gap-2'>
                  <Image
                    source={
                      comment.profile?.profileImageUrl ||
                      'https://via.placeholder.com/40' ||
                      comment.user?.profileImageUrl
                    }
                    style={{ width: 32, height: 32, borderRadius: 100 }}
                  />
                  <View className='flex-1'>
                    <View className='bg-white/5 p-3 rounded-2xl'>
                      <Text className='text-primary text-sm font-roboto-semibold mb-1'>
                        {comment.profile?.displayName ||
                          comment.user?.name ||
                          'Anonymous'}
                      </Text>
                      <Text className='text-primary text-sm font-roboto-regular'>
                        {comment.text}
                      </Text>
                    </View>
                    <View className='flex-row gap-4 mt-1 px-2'>
                      <TouchableOpacity>
                        <Text className='text-secondary text-xs font-roboto-medium'>
                          Like
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity>
                        <Text className='text-secondary text-xs font-roboto-medium'>
                          Reply
                        </Text>
                      </TouchableOpacity>
                      {/* Only show delete if user owns the comment */}
                      {(comment.user?._id === currentUserId ||
                        comment.user?.id === currentUserId) && (
                        <TouchableOpacity
                          onPress={() => handleDeleteComment(comment._id)}
                        >
                          <Text className='text-red-400 text-xs font-roboto-medium'>
                            Delete
                          </Text>
                        </TouchableOpacity>
                      )}
                      <Text className='text-secondary/50 text-xs font-roboto-regular ml-auto'>
                        {new Date(comment.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View className='bg-white/5 p-4 rounded-2xl items-center'>
              <Text className='text-secondary text-sm font-roboto-regular italic'>
                No comments yet. Be the first to comment!
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default PostCard;
