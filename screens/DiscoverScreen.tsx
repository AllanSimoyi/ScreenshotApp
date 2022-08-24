import { Ionicons } from "@expo/vector-icons";
import { FlatList, HStack, Icon, Input, VStack } from 'native-base';
import { useCallback, useEffect, useState } from "react";
import { RefreshControl } from "react-native";
import { CategoryMenu } from "../components/CategoryMenu";
import { CustomError } from "../components/CustomError";
import { CustomHighlight } from "../components/CustomHighlight";
import { CustomImageBackground } from "../components/CustomImageBackground";
import { CustomSkeletons } from "../components/CustomSkeletons";
import { FlatListFooter } from "../components/FlatListFooter";
import { NoListItems } from "../components/NoListItems";
import { ShadowedText } from "../components/ShadowedText";
import { useInfinitePosts } from "../hooks/useInfinitePosts";
import { usePosts } from "../hooks/usePosts";
import { getImageSource } from "../lib/image-rendering";
import { abuseCategory, flattenPostPages, PostCategory, postHasSearchString } from '../lib/posts';
import { shortenString } from "../lib/strings";
import { RootTabScreenProps } from '../types';

export default function DiscoverScreen (props: RootTabScreenProps<'Discover'>) {
  const { route } = props;
  const initialCategory = route.params?.category as PostCategory || abuseCategory;
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<PostCategory>(initialCategory || abuseCategory);
  const { fetchNextPage, refetch, ...query } = useInfinitePosts('infiniteFeed');
  useEffect(() => setCategory(initialCategory), [initialCategory]);
  const categoryItems = query.data?.pages ?
    flattenPostPages(query.data.pages).filter(item => {
      if (search.trim()) {
        return postHasSearchString(item, search);
      }
      return (item.category === category);
    }) :
    [];
  const refetchCallback = useCallback(() => refetch(), [refetch]);
  const searchOnChange = useCallback((text: string) => setSearch(text), []);
  const onEndReached = useCallback(() => fetchNextPage(), [fetchNextPage]);
  return (
    <VStack alignItems="stretch" style={{ height: "100%" }}>
      <HStack alignItems="center">
        <VStack justifyContent="center" alignItems="stretch" p={2} style={{ flexGrow: 1 }} width="70%">
          <Input
            size="xl" width="100%" value={search}
            borderWidth="2" fontWeight="bold" variant="rounded"
            color="yellow.600" placeholder="Search" my="2" py="1" px="4"
            borderColor="yellow.600" onChangeText={searchOnChange}
            InputRightElement={<Icon mx="2" size="6" color="yellow.600" as={<Ionicons name="ios-search" />} />}
          />
        </VStack>
        <VStack justifyContent={"center"} alignItems="center" p={2}>
          <CategoryMenu currentCategory={category} setCurrentCategory={setCategory} />
        </VStack>
      </HStack>
      {query.isError && (
        <CustomError retry={refetchCallback}>
          {query.error.message}
        </CustomError>
      )}
      {query.isLoading && <CustomSkeletons num={4} />}
      <FlatList
        data={categoryItems}
        flexGrow={1}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={<RefreshControl refreshing={query.isLoading} onRefresh={refetchCallback} />}
        ListEmptyComponent={<NoListItems>No posts found</NoListItems>}
        ListFooterComponent={<FlatListFooter listName="Feed" isLoadingMore={query.isFetchingNextPage} atEndOfList={!query.hasNextPage} />}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.2}
        renderItem={({ item }) => (
          <VStack alignItems="stretch" pb={1}>
            <CustomImageBackground
              source={getImageSource(item.resourceUrl)}
              noImageFound={!item.publicId && !item.resourceUrl}
              style={{ flex: 1, justifyContent: 'flex-end', height: 250, width: "100%" }}
            >
              <VStack alignItems="flex-start" py={2} px={4}>
                <ShadowedText>
                  <CustomHighlight searchString={search}>
                    {shortenString(item.description, 100, "addEllipsis")}
                  </CustomHighlight>
                </ShadowedText>
              </VStack>
            </CustomImageBackground>
          </VStack>
        )}
      />
    </VStack>
  );
}
