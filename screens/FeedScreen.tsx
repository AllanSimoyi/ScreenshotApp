import { FlatList, Text, View, VStack } from 'native-base';
import { RefreshControl, StyleSheet } from 'react-native';
import { CustomError } from '../components/custom-error';
import { CustomImageBackground } from '../components/CustomImageBackground';
import { CustomSkeletons } from '../components/CustomSkeletons';
import { ShadowedText } from '../components/ShadowedText';
import { usePosts } from '../hooks/usePosts';
import { getImageSource } from '../lib/image-rendering';
import { Post } from '../lib/posts';
import { RootTabScreenProps } from '../types';

export default function FeedScreen ({ navigation }: RootTabScreenProps<'Feed'>) {
  const query = usePosts('feed');
  const majorPosts = (query.data || []).reduce((acc, post) => {
    const alreadyAdded = acc.some(el => el.category === post.category);
    return alreadyAdded ? acc : [...acc, post];
  }, [] as Post[]);
  return (
    <View style={styles.container}>
      <VStack alignItems="stretch" px={0}>
        {query.isError && (
          <CustomError retry={() => query.refetch()}>
            {query.error.message}
          </CustomError>
        )}
        {query.isLoading && <CustomSkeletons num={4} />}
        {majorPosts && (
          <FlatList
            data={majorPosts}
            keyExtractor={(_, index) => index.toString()}
            refreshControl={<RefreshControl refreshing={query.isLoading} onRefresh={query.refetch} />}
            ListEmptyComponent={(
              <VStack justifyContent={"center"} alignItems="center" p={4}>
                <Text color="white" fontSize={"lg"}>
                  No posts found
                </Text>
              </VStack>
            )}
            renderItem={({ item }) => (
              <VStack alignItems="stretch" pb={1}>
                <CustomImageBackground
                  source={getImageSource(item.resourceUrl)}
                  style={{ flex: 1, justifyContent: 'flex-end', height: 250, width: "100%" }}
                >
                  <VStack alignItems="flex-start" py={2} px={4}>
                    <ShadowedText bottomBorder onPress={() => {
                      navigation.navigate('Discover', { category: item.category });
                    }}>
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