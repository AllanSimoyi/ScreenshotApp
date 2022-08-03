import { FlatList, View, VStack } from 'native-base';
import { ImageBackground, StyleSheet } from 'react-native';
import { useQuery } from 'react-query';
import { CustomError } from '../components/custom-error';
import { CustomSkeletons } from '../components/CustomSkeletons';
import { UnderlinedFeedText } from '../components/UnderlinedFeedText';
import { getRequest } from '../lib/get-request';
import { Post } from '../lib/posts';
import { URL_PREFIX } from '../lib/url-prefix';
import { RootTabScreenProps } from '../types';

export default function FeedScreen ({ navigation }: RootTabScreenProps<'Feed'>) {

  const query = useQuery<Post[], Error>('feed', async () => {
    const [result, err] = await getRequest<{ posts: Post[]; errorMessage: string }>(URL_PREFIX + "/api/feed");
    if (err) {
      throw err;
    }
    if (result?.errorMessage) {
      throw new Error(result?.errorMessage);
    }
    const posts = result?.posts || [];
    return posts.reduce((acc, post) => {
      const alreadyAdded = acc.some(el => el.category === post.category);
      if (alreadyAdded) {
        return acc;
      }
      return [...acc, post];
    }, [] as Post[]);
  });

  return (
    <View style={styles.container}>
      <VStack alignItems="stretch" px={0}>
        {query.isError && (
          <CustomError retry={() => query.refetch()}>
            {query.error.message}
          </CustomError>
        )}
        {query.isLoading && <CustomSkeletons num={4} />}
        {query.data && (
          <FlatList
            data={query.data}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <VStack alignItems="stretch" pb={1}>
                <ImageBackground
                  source={item.resourceUrl ?
                    { uri: item.resourceUrl } :
                    require('../assets/images/image_placeholder.jpeg')}
                  accessible
                  accessibilityLabel="Feed Banner"
                  resizeMode="cover"
                  style={{ flex: 1, justifyContent: 'flex-end', height: 250, width: "100%" }}
                >
                  <VStack alignItems="flex-start" py={2} px={4}>
                    <UnderlinedFeedText onPress={() => navigation.navigate('Discover', { category: item.category })}>
                      #. {item.category}
                    </UnderlinedFeedText>
                  </VStack>
                </ImageBackground>
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});