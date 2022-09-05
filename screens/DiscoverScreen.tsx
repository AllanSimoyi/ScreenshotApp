import { Ionicons } from "@expo/vector-icons";
import { FlatList, HStack, Icon, Input, Pressable, VStack } from 'native-base';
import { useCallback, useEffect, useState } from "react";
import { RefreshControl } from "react-native";
import { useDebounce } from 'use-debounce';
import { CategoryMenu } from "../components/CategoryMenu";
import { CustomError } from "../components/CustomError";
import { CustomHighlight } from "../components/CustomHighlight";
import { CustomImageBackground } from "../components/CustomImageBackground";
import { CustomSkeletons } from "../components/CustomSkeletons";
import { FlatListFooter } from "../components/FlatListFooter";
import { NoListItems } from "../components/NoListItems";
import { PostThumbnail } from "../components/PostThumbnail";
import { ShadowedText } from "../components/ShadowedText";
import { useInfinitePosts } from "../hooks/useInfinitePosts";
import { flattenArrays } from "../lib/arrays";
import { getImageSource } from "../lib/image-rendering";
import { Post, PostCategory } from '../lib/posts';
import { shortenString } from "../lib/strings";
import { RootTabScreenProps } from '../types';

export default function DiscoverScreen (props: RootTabScreenProps<'Discover'>) {
  const { route, navigation: { navigate } } = props;
  const initialCategory = route.params?.category as PostCategory || undefined;
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<PostCategory | undefined>(initialCategory || undefined);
  const [debouncedSearch] = useDebounce(search, 800);
  const { fetchNextPage, refetch, ...query } = useInfinitePosts('infiniteFeed', undefined, debouncedSearch, category);
  useEffect(() => setCategory(initialCategory), [initialCategory]);
  const posts = flattenArrays(query.data?.pages || []);
  const refetchCallback = useCallback(() => refetch(), [refetch]);
  const searchOnChange = useCallback((text: string) => setSearch(text), []);
  const onEndReached = useCallback(() => fetchNextPage(), [fetchNextPage]);
  const closeSearch = useCallback((e: any) => {
    setSearch("");
    setCategory(undefined);
  }, []);
  const navigateToPostDetail = useCallback((post: Post) => {
    navigate('PostDetail', { post });
  }, [navigate]);
  return (
    <VStack alignItems="stretch" minHeight="100%">
      <HStack alignItems="center">
        <VStack justifyContent="center" alignItems="stretch" px={2} style={{ flexGrow: 1 }} width="70%">
          <Input
            width="100%" value={search}
            fontWeight="bold" variant="outline"
            placeholder="Search" my="2" py="1" px="4"
            onChangeText={searchOnChange} fontSize="lg"
            InputRightElement={<Icon onPress={closeSearch} mx="2" size="6" as={<Ionicons name="close" />} />}
          />
        </VStack>
        <VStack justifyContent={"center"} alignItems="center">
          <CategoryMenu setCurrentCategory={setCategory} />
        </VStack>
      </HStack>
      <VStack justifyContent="center" alignItems="stretch" flexGrow={1}>
        {query.isError && (
          <CustomError retry={refetchCallback}>
            {query.error.message}
          </CustomError>
        )}
        {query.isLoading && <CustomSkeletons num={4} />}
        <FlatList
          data={posts}
          flexGrow={1}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={{ flexGrow: 1 }}
          refreshControl={<RefreshControl refreshing={query.isLoading} onRefresh={refetchCallback} />}
          ListEmptyComponent={<NoListItems>No posts found</NoListItems>}
          ListFooterComponent={<FlatListFooter isEmptyList={!posts.length} listName="Feed" isLoadingMore={query.isFetchingNextPage} atEndOfList={!query.hasNextPage} />}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.2}
          renderItem={({ item }) => <PostThumbnail {...item} highlight={search} onPress={() => navigateToPostDetail(item)} />}
        />
      </VStack>
    </VStack>
  );
}
