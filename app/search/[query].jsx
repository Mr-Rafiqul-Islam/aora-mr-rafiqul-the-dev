import { FlatList,  Text, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { searchPosts } from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";
import EmptyState from "@/components/EmptyState";
import VideoCard from "@/components/VideoCard";
import SearchInput from "@/components/SearchInput";
import { useLocalSearchParams } from "expo-router";

const Search = () => {
  const { query } = useLocalSearchParams();
  const { data: posts, refetch } = useAppwrite(()=> searchPosts(query));

  // for tracking currently playing video
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState(null);
  const postsPlayersMap = useRef({});

  useEffect(() => {
    refetch(query);
  }, [query]);

  return (
    <SafeAreaView className="bg-primary min-h-screen">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCard
            video={item}
            currentlyPlayingId={currentlyPlayingId}
            setCurrentlyPlayingId={setCurrentlyPlayingId}
            postsPlayersMap={postsPlayersMap}
          />
        )}
        ListHeaderComponent={() => (
          <View className="flex my-6 px-4 space-y-6">
            <View className="flex justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pmedium text-sm text-gray-100">
                  Search results of
                </Text>
                <Text className="text-2xl font-psemibold text-white">
                  {query}
                </Text>
              </View>
            </View>
            <SearchInput initialQuery={query}/>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="No videos for this query"
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Search;
