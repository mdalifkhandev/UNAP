import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAudioPlayer } from 'expo-audio';
import { Image } from 'expo-image';
import { useVideoPlayer, VideoView } from 'expo-video';
import React from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';

interface MediaPreviewProps {
  photo: string | null;
  video: string | null;
  audio: string | null;
}

function toPlayableCloudinaryVideoUrl(url: string) {
  if (!url) return url;
  if (!url.includes('/res.cloudinary.com/') || !url.includes('/video/upload/')) {
    return url;
  }
  if (url.includes('/video/upload/f_mp4,') || url.includes('/video/upload/f_mp4/')) {
    return url;
  }
  return url.replace(
    '/video/upload/',
    '/video/upload/f_mp4,vc_h264,ac_aac,q_auto:good/'
  );
}

const MediaPreview: React.FC<MediaPreviewProps> = ({ photo, video, audio }) => {
  const isFocused = useIsFocused();
  const audioPlayer = useAudioPlayer(audio || '');
  const [isVideoReady, setIsVideoReady] = React.useState(false);
  const [showSlowVideoHint, setShowSlowVideoHint] = React.useState(false);
  const [videoThumbnail, setVideoThumbnail] = React.useState<any>(null);
  const [thumbnailAttempted, setThumbnailAttempted] = React.useState(false);

  const playbackVideoUrl = React.useMemo(() => {
    if (!video) return '';
    if (!video.startsWith('http')) return video;
    return toPlayableCloudinaryVideoUrl(video);
  }, [video]);

  const videoSource = React.useMemo(
    () => (playbackVideoUrl ? { uri: playbackVideoUrl } : null),
    [playbackVideoUrl]
  );

  const videoPlayer = useVideoPlayer(videoSource as any, player => {
    player.loop = true;
  });

  React.useEffect(() => {
    if (!isFocused || !audio) {
      audioPlayer.pause();
    }
  }, [isFocused, audio, audioPlayer]);

  React.useEffect(() => {
    if (!playbackVideoUrl) return;
    if (isFocused) {
      videoPlayer.play();
    } else {
      videoPlayer.pause();
    }
  }, [isFocused, playbackVideoUrl, videoPlayer]);

  React.useEffect(() => {
    let cancelled = false;
    setIsVideoReady(false);
    setShowSlowVideoHint(false);
    setVideoThumbnail(null);
    setThumbnailAttempted(false);

    if (!playbackVideoUrl) {
      return () => {
        cancelled = true;
      };
    }

    const generateThumbnail = async () => {
      // Try a few times because metadata/decoder may not be ready immediately.
      for (let attempt = 0; attempt < 3; attempt += 1) {
        if (cancelled) return;
        try {
          const thumbs = await videoPlayer.generateThumbnailsAsync(0.1, {
            maxWidth: 1280,
            maxHeight: 720,
          });

          if (!cancelled && Array.isArray(thumbs) && thumbs.length > 0) {
            setVideoThumbnail(thumbs[0]);
            setThumbnailAttempted(true);
            return;
          }
        } catch {
          // ignore and retry
        }

        await new Promise(resolve => setTimeout(resolve, 250));
      }

      if (!cancelled) {
        setThumbnailAttempted(true);
      }
    };

    const timer = setTimeout(() => {
      void generateThumbnail();
    }, 120);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [playbackVideoUrl, videoPlayer]);

  React.useEffect(() => {
    if (!video || isVideoReady) return;

    const timer = setTimeout(() => {
      setShowSlowVideoHint(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, [video, isVideoReady, playbackVideoUrl]);

  const toggleAudioPlayback = () => {
    if (audioPlayer.playing) {
      audioPlayer.pause();
    } else {
      audioPlayer.play();
    }
  };

  const handleRetry = () => {
    setIsVideoReady(false);
    setShowSlowVideoHint(false);
    videoPlayer.pause();
    setTimeout(() => {
      videoPlayer.play();
    }, 150);
  };

  const formatTime = (seconds: number) => {
    const safeSeconds = Number(seconds) || 0;
    const totalSeconds = Math.floor(safeSeconds);
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!photo && !video && !audio) {
    return (
      <View className='w-full h-[100px] justify-center items-center bg-black/10 dark:bg-[#FFFFFF0D] rounded-2xl mb-4 border border-dashed border-black/20 dark:border-[#FFFFFF0D]'>
        <Feather name='image' size={40} color='#666' style={{ opacity: 0.5 }} />
        <Text className='text-gray-400 text-center mt-4 font-roboto-regular'>
          Select media to preview
        </Text>
      </View>
    );
  }

  return (
    <View className='w-full h-[300px] justify-center items-center bg-black/10 dark:bg-[#FFFFFF0D] rounded-2xl mb-4 overflow-hidden relative'>
      {photo && (
        <Image
          source={{ uri: photo }}
          style={{ width: '100%', height: '100%' }}
          contentFit='cover'
        />
      )}

      {video && (
        <View style={styles.videoContainer}>
          <VideoView
            key={playbackVideoUrl || video}
            style={styles.video}
            player={videoPlayer}
            nativeControls
            contentFit='contain'
            allowsPictureInPicture={false}
            useExoShutter={false}
            surfaceType={Platform.OS === 'android' ? 'surfaceView' : undefined}
            onFirstFrameRender={() => {
              setIsVideoReady(true);
              setShowSlowVideoHint(false);
            }}
          />

          {!isVideoReady && videoThumbnail && (
            <Image
              source={videoThumbnail}
              style={styles.video}
              contentFit='contain'
            />
          )}

          {!isVideoReady && (
            <View style={styles.overlay}>
              <ActivityIndicator color='white' />
              <Text style={styles.loadingText}>
                {showSlowVideoHint ? 'Preparing preview...' : 'Loading video...'}
              </Text>
              {showSlowVideoHint && (
                <TouchableOpacity onPress={handleRetry} style={styles.retryButton}>
                  <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
              )}
              {!videoThumbnail && thumbnailAttempted && showSlowVideoHint && (
                <Text style={styles.helperText}>
                  This video codec may not render on this Android device.
                </Text>
              )}
            </View>
          )}
        </View>
      )}

      {audio && (
        <View className='w-full h-full justify-center items-center bg-gray-900/50 p-6'>
          <View className='w-16 h-16 rounded-full bg-[#F0F2F5] dark:bg-[#FFFFFF0D] items-center justify-center mb-4'>
            <Feather name='music' size={32} color='#F54900' />
          </View>

          <Text
            className='text-black dark:text-white font-roboto-medium text-lg mb-1'
            numberOfLines={1}
          >
            {audio.split('/').pop()}
          </Text>
          <Text className='text-gray-400 text-sm mb-6'>Audio Preview</Text>

          <View className='flex-row items-center gap-4 w-full justify-center'>
            <Text className='text-gray-400 text-xs w-10 text-right'>
              {formatTime(audioPlayer.currentTime)}
            </Text>

            <TouchableOpacity
              onPress={toggleAudioPlayback}
              disabled={!audioPlayer.isLoaded}
              className='w-14 h-14 rounded-full bg-white items-center justify-center'
            >
              {!audioPlayer.isLoaded ? (
                <ActivityIndicator color='black' />
              ) : (
                <Ionicons
                  name={audioPlayer.playing ? 'pause' : 'play'}
                  size={24}
                  color='black'
                  style={{ marginLeft: audioPlayer.playing ? 0 : 2 }}
                />
              )}
            </TouchableOpacity>

            <Text className='text-gray-400 text-xs w-10'>
              {formatTime(audioPlayer.duration)}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  videoContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    gap: 8,
  },
  loadingText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 6,
    fontWeight: '500',
  },
  retryButton: {
    marginTop: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  retryText: {
    color: '#fff',
    fontWeight: '500',
  },
  helperText: {
    marginTop: 6,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
    fontSize: 12,
  },
});

export default MediaPreview;
