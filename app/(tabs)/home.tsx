import OfficePostCard from "@/components/card/OfficePostCard";
import PostCard from "@/components/card/PostCard";
import SuggestedArtistsCard from "@/components/card/SuggestedArtistsCard";
import Input from "@/components/inpute/Inpute";
import GradientBackground from "@/components/main/GradientBackground";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Import PostData type from PostCard
interface PostData {
  id: number;
  author: {
    name: string;
    profession: string;
    avatar: string;
  };
  content: {
    text: string;
    image?: string;
  };
  timestamp: string;
  likes: number;
  comments: number;
}

const Home = () => {
  const video = require("@/assets/images/postvideo.png");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [postText, setPostText] = useState("");
  const [posting, setPosting] = useState(false);

  // Dummy API function to create a new post
  const createPost = async (postData: {
    text: string;
    image?: string;
  }): Promise<PostData> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulate API response
    const newPost: PostData = {
      id: Date.now(), // Use timestamp as temporary ID
      author: {
        name: "Current User",
        profession: "Artist",
        avatar: "https://picsum.photos/100/100?random=currentuser"
      },
      content: {
        text: postData.text,
        image: postData.image
      },
      timestamp: "Just now",
      likes: 0,
      comments: 0
    };
    console.log(newPost);
    return newPost;
  };

  // Handle post submission
  const handlePostSubmit = async () => {
    if (!postText.trim() && !selectedImage) {
      alert("Please add some content to your post");
      return;
    }

    setPosting(true);

    try {
      const newPost = await createPost({
        text: postText.trim(),
        image: selectedImage || undefined
      });

      // Add new post to the beginning of the posts array
      setPosts(prevPosts => [newPost, ...prevPosts]);

      // Reset form
      setPostText("");
      setSelectedImage(null);

      alert("Post created successfully!");
    } catch (error) {
      console.error('Error creating post:', error);
      alert("Failed to create post. Please try again.");
    } finally {
      setPosting(false);
    }
  };
  const fetchPosts = async (): Promise<PostData[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Dummy data
    return [
      {
        id: 1,
        author: {
          name: "Maya Lin",
          profession: "Painter",
          avatar: "https://thelightcommittee.com/wp-content/uploads/elementor/thumbs/studio-business-headshot-of-a-black-man-in-Los-Angeles-r42uipeyz48g590yz1bhrtos4flfu3q2tuzohhy7f4.jpg"
        },
        content: {
          text: "New abstract series exploring the intersection of light and shadow. What do you see? #AbstractArt #Minimalism #BlackAndWhite",
          image: "https://picsum.photos/400/345?random=1"
        },
        timestamp: "2h ago",
        likes: 42,
        comments: 8
      },
      {
        id: 2,
        author: {
          name: "Sarah Chen",
          profession: "Photographer",
          avatar: "https://picsum.photos/100/100?random=2"
        },
        content: {
          text: "Golden hour magic in the city. Sometimes the best moments happen when you least expect them. #UrbanPhotography #GoldenHour #CityLife"
        },
        timestamp: "5h ago",
        likes: 128,
        comments: 23
      },
      {
        id: 3,
        author: {
          name: "Marcus Johnson",
          profession: "Digital Artist",
          avatar: "https://picsum.photos/100/100?random=3"
        },
        content: {
          text: "Experimenting with generative art and neural networks. The future of creativity is here! #DigitalArt #AI #GenerativeArt",
          image: "https://picsum.photos/400/345?random=3"
        },
        timestamp: "1d ago",
        likes: 256,
        comments: 45
      },
      {
        id: 4,
        author: {
          name: "Elena Rodriguez",
          profession: "Sculptor",
          avatar: "https://picsum.photos/100/100?random=4"
        },
        content: {
          text: "Working on a new piece for the upcoming gallery exhibition. Marble has such a beautiful way of telling stories. #Sculpture #Marble #ArtStudio"
        },
        timestamp: "2d ago",
        likes: 89,
        comments: 12
      },
      {
        id: 5,
        author: {
          name: "David Kim",
          profession: "Illustrator",
          avatar: "https://picsum.photos/100/100?random=5"
        },
        content: {
          text: "Character design process breakdown! From sketch to final render. Swipe to see the evolution. #CharacterDesign #Illustration #ArtProcess",
          image: "https://picsum.photos/400/345?random=5"
        },
        timestamp: "3d ago",
        likes: 342,
        comments: 67
      }
    ];
  };

  // Fetch posts on component mount
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const fetchedPosts = await fetchPosts();
        setPosts(fetchedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);
  const handleImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  return (
    <GradientBackground>
      <SafeAreaView
        className="flex-1 mx-6 mt-2.5 mb-17"
        edges={["top", "left", "right"]}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 72 }}
          >
            {/* home header */}
            <View className="flex-row justify-between items-center mx-4 mt-3">
              <TouchableOpacity>
                <Image
                  source={require("@/assets/images/logo.png")}
                  style={{ width: 60, height: 26 }}
                  contentFit="contain"
                />
              </TouchableOpacity>
              <View className="flex-row gap-3 items-center">
                <TouchableOpacity
                  onPress={() => router.push("/screens/home/notification")}
                >
                  <Ionicons
                    name="notifications-outline"
                    size={24}
                    color="white"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => router.push("/(tabs)/profile")}
                >
                  <Image
                    source={require("@/assets/images/profile.png")}
                    style={{
                      width: 30,
                      height: 30,
                    }}
                    contentFit="contain"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* post create card */}
            <View className="p-6 bg-[#FFFFFF0D] rounded-3xl mt-6 flex-row gap-5">
              <TouchableOpacity
                onPress={() => router.push("/(tabs)/profile")}
                className="mt-2"
              >
                <Image
                  source={require("@/assets/images/profile.png")}
                  style={{
                    width: 30,
                    height: 30,
                  }}
                  contentFit="contain"
                />
              </TouchableOpacity>
              <View className=" flex-1">
                <Input
                  placeholder="What's on your mind?"
                  inputeStyle="pb-10"
                  value={postText}
                  onChangeText={setPostText}
                  multiline
                />
                <View className="flex-row justify-between mt-5">
                  <View className="flex-row gap-6">
                    <TouchableOpacity
                      onPress={handleImagePicker}
                      className="flex-row items-center gap-2"
                    >
                      <Feather name="image" size={18} color="white" />
                      <Text className="text-white">Photo</Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    className="px-4 py-2 bg-primary rounded-xl"
                    onPress={handlePostSubmit}
                    disabled={posting}
                  >
                    <Text className="">
                      {posting ? "Posting..." : "Post"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* post card - First 2 posts */}
            {!loading && posts.slice(0, 2).map((post) => (
              <PostCard key={post.id} post={post} className="mt-4" />
            ))}
            <OfficePostCard className="mt-4" />
            <SuggestedArtistsCard className="mt-4" />

            {/* All posts */}
            {!loading && posts.map((post) => (
              <PostCard key={post.id} post={post} className="mt-4" />
            ))}

            {/* Loading state */}
            {loading && (
              <View className="mt-4 p-4 bg-[#FFFFFF0D] rounded-3xl">
                <Text className="text-white text-center">Loading posts...</Text>
              </View>
            )}

            {/* ..........end......... */}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default Home;
