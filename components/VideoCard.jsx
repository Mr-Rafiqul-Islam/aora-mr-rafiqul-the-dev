import { icons } from "@/constants";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

const VideoCard = ({
  video: {
    title,
    thumbnail,
    video,
    creator: { username, avatar },
    $id,
  },
  currentlyPlayingId,
  setCurrentlyPlayingId,
  postsPlayersMap,
}) => {
  const [play, setPlay] = useState(false);
  const player = useVideoPlayer(video, (p) => {
    p.loop = false;
  });

  // Register player in global map
  const map = postsPlayersMap.current;
  useEffect(() => {
    const entry = { player, setPlay };
    map[$id] = entry;

    return () => {
      if (map[$id] === entry) {
        delete map[$id];
      }
    };
  }, [$id, player, map]);

  const handlePlay = () => {
    if (
      currentlyPlayingId &&
      postsPlayersMap.current[currentlyPlayingId] &&
      currentlyPlayingId !== $id
    ) {
      const prev = postsPlayersMap.current[currentlyPlayingId];
      prev.player.pause();
      prev.player.currentTime = 0; // ✅ reset previous video
      prev.setPlay(false);
    }

    setPlay(true);
    setCurrentlyPlayingId($id);
    player.currentTime = 0; // ✅ reset current video before playing
    player.play();
  };

  return (
    <View className="flex flex-col items-center px-4 mb-14">
      <View className="flex flex-row gap-3 items-start">
        <View className="flex justify-center items-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary flex justify-center items-center p-0.5">
            <Image
              source={{ uri: avatar }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          </View>

          <View className="flex justify-center flex-1 ml-3 gap-y-1">
            <Text
              className="font-psemibold text-sm text-white"
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text
              className="text-xs text-gray-100 font-pregular"
              numberOfLines={1}
            >
              {username}
            </Text>
          </View>
        </View>

        <View className="pt-2">
          <Image source={icons.menu} className="w-5 h-5" resizeMode="contain" />
        </View>
      </View>

      {play ? (
        <View className="w-full h-60 rounded-xl mt-3 bg-white/10 overflow-hidden">
          <VideoView
            player={player}
            style={{ width: "100%", height: "100%", borderRadius: 12 }}
            allowsFullscreen
            allowsPictureInPicture
          />
        </View>
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handlePlay}
          className="w-full h-60 rounded-xl mt-3 relative flex justify-center items-center"
        >
          <Image
            source={{ uri: thumbnail }}
            className="w-full h-full rounded-xl mt-3"
            resizeMode="cover"
          />

          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default VideoCard;
