import {
    useDeleteComment,
    useUserCreateComment,
    useUserFollow,
    useUserGetComment,
    useUserLike,
    useUserUnFollow,
    useUserUnLike,
} from '@/hooks/app/home';
import {
    useCancelScheduledPost,
    useDeletePost,
    useSavePost,
    useSharePost,
    useUnsavePost,
} from '@/hooks/app/post';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import React, { useEffect, useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

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
  scheduledFor?: string; // Add scheduledFor property
  shareToFacebook?: boolean;
  shareToInstagram?: boolean;
}

const PostCard = ({
  className,
  img,
  post,
  currentUserId,
  isSavedScreen = false,
  isScheduled = false,
  showOwnerActions = false, // Only show Edit/Delete on Profile screen
  hideFollowButton = false, // Hide follow button for UBlast submissions
}: {
  className?: string;
  img?: any;
  post?: Post;
  currentUserId?: string;
  isSavedScreen?: boolean;
  isScheduled?: boolean;
  showOwnerActions?: boolean;
  hideFollowButton?: boolean;
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

  const { mutate: followUser } = useUserFollow();
  const { mutate: unfollowUser } = useUserUnFollow();
  const { mutate: likeUser } = useUserLike();
  const { mutate: unLikeUser } = useUserUnLike();
  const { mutate: savePost } = useSavePost();
  const { mutate: unsavePost } = useUnsavePost();
  const { mutate: deletePost } = useDeletePost();
  const { mutate: cancelScheduledPost } = useCancelScheduledPost();
  const { mutate: sharePost } = useSharePost();

  const [isBookmarked, setIsBookmarked] = useState(
    // @ts-ignore
    post?.viewerHasBookmarked || false
  );

  useEffect(() => {
    if (post) {
      setIsFollowing(post.viewerIsFollowing);
      setIsLiked(post.viewerHasLiked);
      setLikeCount(post.likeCount);
      // @ts-ignore
      setIsBookmarked(post.viewerHasBookmarked || false);
    }
  }, [
    post?.viewerIsFollowing,
    post?.viewerHasLiked,
    post?.likeCount,
    // @ts-ignore
    post?.viewerHasBookmarked,
  ]);

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

  const handleBookmarkToggle = () => {
    if (!post?._id) return;

    if (isSavedScreen) {
      // On saved screen, only allowed to unsave (delete)
      unsavePost(post._id);
      setIsBookmarked(false);
    } else {
      // On home screen, only allowed to save
      if (!isBookmarked) {
        savePost(post._id);
        setIsBookmarked(true);
      } else {
        Toast.show({
          type: 'info',
          text1: 'Post Saved',
          text2: 'This post is already in your saved collection.',
        });
      }
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

  const handleDeletePost = () => {
    if (!post?._id) return;
    // Show confirmation dialog before deleting
    Alert.alert('Delete Post', 'Are you sure you want to delete this post?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deletePost(post._id),
      },
    ]);
  };

  const handleCancelScheduled = () => {
    if (!post?._id) return;
    Alert.alert(
      'Cancel Scheduled Post',
      'Are you sure you want to cancel this scheduled post?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => cancelScheduledPost(post._id),
        },
      ]
    );
  };

  const handleSharePost = () => {
    if (!post?._id) return;
    Alert.alert('Share Post', 'Are you sure you want to share this post?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Share',
        onPress: () => sharePost(post._id),
      },
    ]);
  };

  // Use post data if provided, otherwise use defaults
  const authorName =
    post?.profile?.displayName || post?.author?.name || 'Maya Lin';
  const authorProfession = post?.profile?.role || 'Painter';
  const authorAvatar =
    post?.profile?.profileImageUrl ||
    'https://thelightcommittee.com/wp-content/uploads/elementor/thumbs/studio-business-headshot-of-a-black-man-in-Los-Angeles-r42uipeyz48g590yz1bhrtos4flfu3q2tuzohhy7f4.jpg';
  const postText =
    post?.description ||
    'New abstract series exploring the \n intersection of light and shadow. What do you see? #AbstractArt #Minimalism #BlackAndWhite';
  const postImage = post?.mediaUrl || img;
  // Format timestamp if needed, or just use raw string for now
  const timestamp = post?.createdAt
    ? new Date(post.createdAt).toLocaleDateString()
    : '2h ago';

  const scheduledTime = post?.scheduledFor
    ? new Date(post.scheduledFor).toLocaleString([], {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : '';

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
            {isScheduled ? (
              <Text className='font-roboto-medium text-xs text-blue-400'>
                Scheduled: {scheduledTime}
              </Text>
            ) : (
              <Text className='font-roboto-regular text-sm text-secondary'>
                {authorProfession}
              </Text>
            )}
          </View>
        </TouchableOpacity>

        {isScheduled ? (
          <View className='flex-row gap-2'>
            <TouchableOpacity
              className='py-1.5 px-3 rounded-full bg-white/10 border border-white/20'
              onPress={() =>
                router.push({
                  pathname: '/(tabs)/create',
                  params: {
                    postId: post?._id,
                    description: post?.description,
                    mediaUrl: post?.mediaUrl,
                    mediaType: post?.mediaType,
                    scheduledFor: post?.scheduledFor,
                    shareToFacebook: post?.shareToFacebook ? 'true' : 'false',
                    shareToInstagram: post?.shareToInstagram ? 'true' : 'false',
                  },
                })
              }
            >
              <Text className='font-roboto-medium text-white text-xs'>
                Edit
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className='py-1.5 px-3 rounded-full bg-red-500/20 border border-red-500/50'
              onPress={handleCancelScheduled}
            >
              <Text className='font-roboto-medium text-red-400 text-xs'>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        ) : isOwner && showOwnerActions ? (
          <View className='flex-row gap-2'>
            <TouchableOpacity
              className='py-1.5 px-3 rounded-full bg-white/10 border border-white/20'
              onPress={() =>
                router.push({
                  pathname: '/(tabs)/create',
                  params: {
                    postId: post?._id,
                    description: post?.description,
                    mediaUrl: post?.mediaUrl,
                    mediaType: post?.mediaType,
                    shareToFacebook: post?.shareToFacebook ? 'true' : 'false',
                    shareToInstagram: post?.shareToInstagram ? 'true' : 'false',
                    isPublishedConfig: 'true', // Flag to indicate editing a published post
                  },
                })
              }
            >
              <Text className='font-roboto-medium text-white text-xs'>
                Edit
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className='py-1.5 px-3 rounded-full bg-red-500/20 border border-red-500/50'
              onPress={handleDeletePost}
            >
              <Text className='font-roboto-medium text-red-400 text-xs'>
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        ) : !isOwner && !hideFollowButton ? (
          <TouchableOpacity
            className={`py-2 px-6 rounded-full items-center justify-center ${isFollowing ? 'bg-transparent border border-secondary/30' : ''}`}
            onPress={handleFollowToggle}
          >
            <Text
              className={`font-roboto-semibold ${isFollowing ? 'text-secondary' : 'text-primary'}`}
            >
              {isFollowing ? 'Unfollow' : 'Follow '}
            </Text>
          </TouchableOpacity>
        ) : null}
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
            disabled={isScheduled} // Disable interactions on scheduled posts
          >
            <Ionicons
              name={isLiked ? 'heart' : 'heart-outline'}
              size={26}
              color={`${isLiked ? 'red' : 'white'}`}
              style={{ opacity: isScheduled ? 0.5 : 1 }}
            />
            {likeCount > 0 && (
              <Text className='text-white font-roboto-medium'>{likeCount}</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowComments(!showComments)}
            className='flex-row items-center gap-1.5'
            disabled={isScheduled}
          >
            <Ionicons
              name='chatbubble-outline'
              size={24}
              color='white'
              style={{ opacity: isScheduled ? 0.5 : 1 }}
            />
            {post?.commentCount !== undefined && post.commentCount > 0 && (
              <Text className='text-white font-roboto-medium'>
                {post.commentCount}
              </Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity disabled={isScheduled} onPress={handleSharePost}>
            <Ionicons
              name='share-social-outline'
              size={24}
              color='white'
              style={{ opacity: isScheduled ? 0.5 : 1 }}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleBookmarkToggle} disabled={isScheduled}>
          <Ionicons
            name={
              isSavedScreen
                ? 'trash-outline'
                : isBookmarked
                  ? 'bookmark'
                  : 'bookmark-outline'
            }
            size={24}
            color={isSavedScreen ? '#FF4B4B' : 'white'}
            style={{ opacity: isScheduled ? 0.5 : 1 }}
          />
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
      {showComments && !isScheduled && (
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
