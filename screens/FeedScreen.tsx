import { Alert, Button, FlatList, Flex, HStack, Skeleton, Text, View, VStack } from 'native-base';
import { ImageBackground, StyleSheet } from 'react-native';
import { useQuery } from 'react-query';
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
      if (alreadyAdded)
        return acc;
      return [...acc, post];
    }, [] as Post[]);
  });

  return (
    <View style={styles.container}>
      <Flex
        direction="column"
        justify="flex-start"
        align="stretch"
        px="0"
      >
        {
          query.isError &&
          <Flex
            direction="column"
            justify="center"
            align="stretch"
            p="4"
            style={{ height: "100%" }}
          >
            <Alert w="100%" status="error">
              <VStack space={2} flexShrink={1} w="100%">
                <HStack flexShrink={1} space={2} justifyContent="space-between">
                  <HStack space={2} flexShrink={1}>
                    <Alert.Icon mt="1" />
                    <Text fontSize="md" color="coolGray.800">
                      {query.error.message}
                    </Text>
                  </HStack>
                </HStack>
                <Flex
                  direction="column"
                  justify="center"
                  align="center">
                  <Button borderColor="black" onPress={() => query.refetch()} variant="outline">
                    RETRY
                  </Button>
                </Flex>
              </VStack>
            </Alert>
          </Flex>
        }
        {
          query.isLoading && (
            <>
              <Flex
                flexDirection="column"
                justify="flex-start"
                align="stretch"
                p="4">
                <Skeleton mb="4" h="40" rounded="10" />
                <Skeleton mb="4" h="40" rounded="10" />
                <Skeleton mb="4" h="40" rounded="10" />
                <Skeleton mb="4" h="40" rounded="10" />
              </Flex>
            </>
          )
        }
        {
          query.data &&
          <FlatList
            data={query.data}
            renderItem={({ item }) => {
              return (
                <Flex
                  direction="column"
                  justify="flex-start"
                  align="stretch"
                  pb="1"
                >
                  <ImageBackground
                    source={{ uri: item.resourceUrl }}
                    accessible
                    accessibilityLabel="Feed Banner"
                    resizeMode="cover"
                    style={{ flex: 1, justifyContent: 'flex-end', height: 250, width: "100%" }}
                  >
                    <Flex
                      direction="column"
                      justify="flex-start"
                      align="flex-start"
                      py="2"
                      px="4">
                      <Text
                        fontSize="lg"
                        fontWeight="bold"
                        color="#fff"
                        borderBottomWidth={2}
                        borderBottomColor={"orange.400"}
                        onPress={() => navigation.navigate('Discover', { category: item.category })}
                        style={{
                          textShadowColor: 'rgba(0, 0, 0, 0.95)',
                          textShadowOffset: { width: -2, height: 2 },
                          textShadowRadius: 20,
                        }}>
                        # {item.category}
                      </Text>
                    </Flex>
                  </ImageBackground>
                </Flex>
              )
            }}
            keyExtractor={(_, index) => index.toString()}
          />
        }
      </Flex>
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