import { useEffect, useState } from "react";
import * as Animatable from "react-native-animatable";
import { useVideoPlayer, VideoView } from "expo-video";
import { Image, ImageBackground, TouchableOpacity, View } from "react-native";
import { icons } from "../constants";

const zoomIn = { 0: { scale: 0.9 }, 1: { scale: 1 } };
const zoomOut = { 0: { scale: 1 }, 1: { scale: 0.9 } };

const TrendingItem = ({
  item,
  activeItem,
  currentlyPlayingId,
  setCurrentlyPlayingId,
  playersMap,
}) => {
  const [showVideo, setShowVideo] = useState(false);

  const player = useVideoPlayer(item.video, (p) => {
    p.loop = false;
  });

  // Register player in global map
  const map = playersMap.current;
  useEffect(() => {
    const entry = { player, setShowVideo };
    map[item.$id] = entry;

    return () => {
      if (map[item.$id] === entry) {
        delete map[item.$id];
      }
    };
  }, [item.$id,player,map]);

  const handlePlay = () => {
  if (
    currentlyPlayingId &&
    playersMap.current[currentlyPlayingId] &&
    currentlyPlayingId !== item.$id
  ) {
    const prev = playersMap.current[currentlyPlayingId];
    prev.player.pause();
    prev.player.currentTime = 0; // ✅ reset previous video
    prev.setShowVideo(false);
  }

  setShowVideo(true);
  setCurrentlyPlayingId(item.$id);
  player.currentTime = 0; // ✅ reset current video before playing
  player.play();
};


  return (
    <Animatable.View
      className="mr-5"
      animation={activeItem === item.$id ? zoomIn : zoomOut}
      duration={500}
    >
      {showVideo ? (
        <View className="w-52 h-72 rounded-[33px] mt-3 bg-white/10 overflow-hidden">
          <VideoView
            player={player}
            style={{ width: "100%", height: "100%", borderRadius: 33 }}
            allowsFullscreen
            allowsPictureInPicture
          />
        </View>
      ) : (
        <TouchableOpacity
          className="relative flex justify-center items-center"
          activeOpacity={0.7}
          onPress={handlePlay}
        >
          <ImageBackground
            source={{ uri: item.thumbnail }}
            className="w-52 h-72 rounded-[33px] my-5 overflow-hidden shadow-lg shadow-black/40"
            resizeMode="cover"
          />
          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </Animatable.View>
  );
};

export default TrendingItem;
