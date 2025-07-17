import { useRef, useState } from "react";
import { FlatList } from "react-native";
import TrendingItem from "./TrendingItem";

const Trending = ({ posts }) => {
  const [activeItem, setActiveItem] = useState(posts[0]?.$id);
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState(null);
  const playersMap = useRef({});

  const viewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveItem(viewableItems[0].key);
    }
  };

  return (
    <FlatList
      data={posts}
      horizontal
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => (
        <TrendingItem
          item={item}
          activeItem={activeItem}
          currentlyPlayingId={currentlyPlayingId}
          setCurrentlyPlayingId={setCurrentlyPlayingId}
          playersMap={playersMap}
        />
      )}
      onViewableItemsChanged={viewableItemsChanged}
      viewabilityConfig={{ itemVisiblePercentThreshold: 70 }}
      contentOffset={{ x: 170 }}
    />
  );
};

export default Trending;
