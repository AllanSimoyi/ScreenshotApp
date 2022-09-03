import { FlatList, View, VStack } from 'native-base';
import { useCallback } from 'react';
import { RefreshControl, StyleSheet } from 'react-native';
import { CustomError } from '../components/CustomError';
import { CustomImageBackground } from '../components/CustomImageBackground';
import { CustomSkeletons } from '../components/CustomSkeletons';
import { FlatListFooter } from '../components/FlatListFooter';
import { NoListItems } from '../components/NoListItems';
import { ShadowedText } from '../components/ShadowedText';
import { useInfinitePosts } from '../hooks/useInfinitePosts';
import { flattenArrays } from '../lib/arrays';
import { getPostThumbnailUrl } from '../lib/cloudinary';
import { getImageSource } from '../lib/image-rendering';
import { Post } from '../lib/posts';
import { shortenString } from '../lib/strings';
import { RootTabScreenProps } from '../types';

export default function FeedScreen (props: RootTabScreenProps<'Feed'>) {
  const { navigate } = props.navigation;
  const { fetchNextPage, refetch, ...query } = useInfinitePosts('infiniteFeed');
  const refetchCallback = useCallback(() => refetch(), [refetch]);
  const navigateToDiscover = useCallback((category: string) => {
    navigate('Discover', { category });
  }, [navigate]);
  const onEndReached = useCallback(() => fetchNextPage(), [fetchNextPage]);
  const posts = flattenArrays(query.data?.pages || [] as Post[][]);
  return (
    <View style={styles.container}>
      <VStack alignItems="stretch">
        {query.isError && (
          <CustomError retry={refetchCallback}>
            {query.error.message}
          </CustomError>
        )}
        {query.isLoading && <CustomSkeletons num={4} />}
        {query.data?.pages && (
          <FlatList
            data={posts}
            keyExtractor={(_, index) => index.toString()}
            contentContainerStyle={{ flexGrow: 1 }}
            refreshControl={<RefreshControl refreshing={query.isLoading} onRefresh={refetchCallback} />}
            ListEmptyComponent={<NoListItems>No posts found</NoListItems>}
            ListFooterComponent={<FlatListFooter isEmptyList={!posts.length} listName="Feed" isLoadingMore={query.isFetchingNextPage} atEndOfList={!query.hasNextPage} />}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.2}
            renderItem={({ item }) => (
              <VStack alignItems="stretch" pb={1}>
                <CustomImageBackground
                  source={getImageSource(getPostThumbnailUrl(item.publicId, item.resourceUrl))}
                  noImageFound={!item.publicId && !item.resourceUrl}
                  style={{ flex: 1, justifyContent: 'flex-end', height: 250, width: "100%" }}
                >
                  <VStack alignItems="flex-start" py={2} px={4}>
                    <ShadowedText>
                      {shortenString(item.description, 100, "addEllipsis")}
                    </ShadowedText>
                  </VStack>
                </CustomImageBackground>
              </VStack>
            )}
          />
        )}
      </VStack>
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
});