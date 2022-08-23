import { FlatList, View, VStack } from 'native-base';
import { useCallback } from 'react';
import { RefreshControl, StyleSheet } from 'react-native';
import { CustomError } from '../components/CustomError';
import { CustomImageBackground } from '../components/CustomImageBackground';
import { CustomSkeletons } from '../components/CustomSkeletons';
import { NoListItems } from '../components/NoListItems';
import { ShadowedText } from '../components/ShadowedText';
import { usePosts } from '../hooks/usePosts';
import { getImageSource } from '../lib/image-rendering';
import { Post } from '../lib/posts';
import { RootTabScreenProps } from '../types';

export default function OldFeedScreen (props: RootTabScreenProps<'Feed'>) {
  const { navigate } = props.navigation;
  const { refetch, ...query } = usePosts('feed');
  const majorPosts = (query.data || []).reduce((acc, post) => {
    const alreadyAdded = acc.some(el => el.category === post.category);
    return alreadyAdded ? acc : [...acc, post];
  }, [] as Post[]);
  const refetchCallback = useCallback(() => refetch(), [refetch]);
  const navigateToDiscover = useCallback((category: string) => {
    navigate('Discover', { category });
  }, [navigate]);
  return (
    <View style={styles.container}>
      <VStack alignItems="stretch">
        {query.isError && (
          <CustomError retry={refetchCallback}>
            {query.error.message}
          </CustomError>
        )}
        {query.isLoading && <CustomSkeletons num={4} />}
        {majorPosts && (
          <FlatList
            data={majorPosts}
            keyExtractor={(_, index) => index.toString()}
            contentContainerStyle={{ flexGrow: 1 }}
            refreshControl={<RefreshControl refreshing={query.isLoading} onRefresh={refetchCallback} />}
            ListEmptyComponent={<NoListItems>No posts found</NoListItems>}
            renderItem={({ item }) => (
              <VStack alignItems="stretch" pb={1}>
                <CustomImageBackground
                  source={getImageSource(item.resourceUrl)}
                  style={{ flex: 1, justifyContent: 'flex-end', height: 250, width: "100%" }}
                >
                  <VStack alignItems="flex-start" py={2} px={4}>
                    <ShadowedText bottomBorder onPress={() => navigateToDiscover(item.category)}>
                      # {item.category}
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