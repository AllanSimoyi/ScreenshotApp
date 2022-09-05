import { FlatList, Pressable, View, VStack } from 'native-base';
import { useCallback } from 'react';
import { RefreshControl, StyleSheet } from 'react-native';
import { CustomError } from '../components/CustomError';
import { CustomImageBackground } from '../components/CustomImageBackground';
import { CustomSkeletons } from '../components/CustomSkeletons';
import { FlatListFooter } from '../components/FlatListFooter';
import { NoListItems } from '../components/NoListItems';
import { PostThumbnail } from '../components/PostThumbnail';
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
  const navigateToPostDetail = useCallback((post: Post) => {
    navigate('PostDetail', { post });
  }, [navigate]);
  const onEndReached = useCallback(() => fetchNextPage(), [fetchNextPage]);
  const posts = flattenArrays(query.data?.pages || [] as Post[][]);
  return (
    <View style={styles.container}>
      <VStack justifyContent="center" alignItems="stretch" minHeight="100%">
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
            renderItem={({ item }) => <PostThumbnail {...item} onPress={() => navigateToPostDetail(item)} />}
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