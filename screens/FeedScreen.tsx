import { FlatList, View, VStack } from 'native-base';
import { ImageBackground, StyleSheet } from 'react-native';
import { useQuery } from 'react-query';
import { CustomError } from '../components/custom-error';
import { CustomImageBackground } from '../components/CustomImageBackground';
import { CustomSkeletons } from '../components/CustomSkeletons';
import { ShadowedText } from '../components/ShadowedText';
import { usePosts } from '../hooks/usePosts';
import { getRequest } from '../lib/get-request';
import { getImageSource } from '../lib/image-rendering';
import { Post } from '../lib/posts';
import { URL_PREFIX } from '../lib/url-prefix';
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
            data={query.data}
            keyExtractor={(_, index) => index.toString()}
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