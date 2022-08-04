import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Alert, Button, FlatList, Flex, HStack, Icon, IconButton, Input, Skeleton, Text, VStack } from 'native-base';
import { useEffect, useState } from "react";
import { ImageBackground, StyleSheet } from 'react-native';
import { useQuery } from 'react-query';
import { CustomHighlight } from "../components/custom-highlight";
import { usePosts } from "../hooks/usePosts";
import { getRequest } from '../lib/get-request';
import { Post, postHasSearchString } from '../lib/posts';
import { URL_PREFIX } from '../lib/url-prefix';
import { RootTabScreenProps } from '../types';

interface FeedItem {
  image: any,
  category: string;
  description?: string;
}

const abuseCategory: FeedItem = {
  image: require('../assets/images/feed_banner.jpeg'),
  category: "Abuse of State Resources"
};

const categoryOptions: FeedItem[] = [
  abuseCategory,
  {
    image: require('../assets/images/violence.jpeg'),
    category: "Public Finance Management"
  },
  {
    image: require('../assets/images/tollgate.jpeg'),
    category: "Natural Resource Governance"
  },
];

const feedItems: FeedItem[] = [
  {
    image: require('../assets/images/feed_banner.jpeg'),
    category: "Abuse of State Resources",
    description: "Short description of the report goes here...",
  },
  {
    image: require('../assets/images/violence.jpeg'),
    category: "Public Finance Management",
    description: "Short description of the report goes here...",
  },
  {
    image: require('../assets/images/tollgate.jpeg'),
    category: "Natural Resource Governance",
    description: "Short description of the report goes here...",
  },
  {
    image: require('../assets/images/feed_banner.jpeg'),
    category: "Public Finance Management",
    description: "Short description of the report goes here...",
  },
  {
    image: require('../assets/images/zupco.jpeg'),
    category: "Natural Resource Governance",
    description: "Short description of the report goes here...",
  },
  {
    image: require('../assets/images/town_house.jpeg'),
    category: "Abuse of State Resources",
    description: "Short description of the report goes here...",
  },
  {
    image: require('../assets/images/violence.jpeg'),
    category: "Public Finance Management",
    description: "Short description of the report goes here...",
  },
  {
    image: require('../assets/images/tollgate.jpeg'),
    category: "Natural Resource Governance",
    description: "Short description of the report goes here...",
  },
  {
    image: require('../assets/images/town_house.jpeg'),
    category: "Public Finance Management",
    description: "Short description of the report goes here...",
  },
  {
    image: require('../assets/images/zupco.jpeg'),
    category: "Natural Resource Governance",
    description: "Short description of the report goes here...",
  },
  {
    image: require('../assets/images/tollgate.jpeg'),
    category: "Abuse of State Resources",
    description: "Short description of the report goes here...",
  },
  {
    image: require('../assets/images/town_house.jpeg'),
    category: "Abuse of State Resources",
    description: "Short description of the report goes here...",
  },
]

export default function DiscoverScreen ({ navigation, route }: RootTabScreenProps<'Discover'>) {
  const initialCategory = route.params?.category || abuseCategory.category;
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(initialCategory || abuseCategory.category);
  const query = usePosts('discover');
  useEffect(() => {
    setCategory(initialCategory);
  }, [initialCategory])
  const categoryItems = query.data ?
    query.data
      .filter(item => item.category === category)
      .filter(item => postHasSearchString(item, search)) :
    [];
  return (
    <Flex
      direction="column"
      justify="flex-start"
      align="stretch"
      px="0"
      style={{ height: "100%" }}
    >
      <Flex
        direction="row"
        justify="flex-start"
        align="center">
        <Flex
          direction="column"
          justify="center"
          align="stretch"
          // minWidth="full"
          width="70%"
          p="2"
          style={{ flexGrow: 1 }}
        >
          <Input
            value={search}
            onChangeText={(text) => setSearch(text)}
            size="xl"
            fontWeight="bold"
            color="yellow.600"
            // width="80%"
            width="100%"
            placeholder="Search"
            variant="rounded"
            borderColor="yellow.600"
            borderWidth="2"
            my="2"
            py="1"
            px="4"
            InputRightElement={
              <Icon
                mx="2"
                size="6"
                color="yellow.600"
                as={<Ionicons name="ios-search" />}
              />}
          />
        </Flex>
        <Flex
          direction="column"
          justify="center"
          align="center"
          p="2">
          <IconButton
            colorScheme="yellow"
            size="md"
            borderWidth={2}
            borderRadius="full"
            variant="outline"
            onPress={() => query.refetch()}
            _icon={{
              as: MaterialIcons,
              name: "sync"
            }} />
        </Flex>
      </Flex>
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
      <FlatList
        horizontal={true}
        data={categoryItems}
        // height={320}
        flexGrow={1}
        renderItem={({ item }) => {
          return (
            <Flex
              direction="column"
              justify="flex-start"
              align="stretch"
              px="2"
              py="4">
              <Flex
                direction="column"
                justify="flex-start"
                align="stretch"
                // style={{ height: 320 }}
                style={{ height: "100%" }}
              >
                <ImageBackground
                  source={item.resourceUrl ?
                    { uri: item.resourceUrl } :
                    require('../assets/images/image_placeholder.jpeg')}
                  accessible
                  borderRadius={10}
                  accessibilityLabel="Feed Banner"
                  resizeMode="cover"
                  // style={{ flex: 1, justifyContent: 'flex-end', height: 320, width: 200, }}
                  style={{ flex: 1, justifyContent: 'flex-end', flexGrow: 1, width: 200, }}
                >
                  <Flex
                    direction="column"
                    justify="flex-start"
                    align="flex-start"
                    py="2"
                    px="2">
                    <Text
                      fontSize="lg"
                      fontWeight="bold"
                      color="#fff"
                      onPress={() => navigation.navigate('Discover', { category: item.category })}
                      style={{
                        textShadowColor: 'rgba(0, 0, 0, 0.95)',
                        textShadowOffset: { width: -2, height: 2 },
                        textShadowRadius: 20,
                      }}>
                      <CustomHighlight searchString={search}>
                        {item.description || "..."}
                      </CustomHighlight>
                    </Text>
                  </Flex>
                </ImageBackground>
              </Flex>
            </Flex>
          )
        }}
        keyExtractor={(_, index) => index.toString()}
      />
      < Flex flexGrow={1} />
      <Flex
        direction="row"
        justify="center"
        align="stretch">
        {categoryOptions.map(option => (
          <Flex
            key={categoryOptions.indexOf(option).toString()}
            direction="column"
            justify="flex-end"
            align="flex-start"
            py="4"
            px="4"
            style={{ width: "33%" }}>
            <Text
              // textAlign="center"
              onPressIn={() => setCategory(option.category)}
              fontSize="md"
              fontWeight="bold"
              color="#fff"
              pb="2"
              borderBottomWidth={category === option.category ? 2 : undefined}
              borderBottomColor={category === option.category ? "orange.400" : undefined}
              onPress={() => navigation.navigate('Discover', { category: option.category })}
              style={{
                textShadowColor: 'rgba(0, 0, 0, 0.95)',
                textShadowOffset: { width: -2, height: 2 },
                textShadowRadius: 20,
              }}>
              {option.category}
            </Text>
          </Flex>
        ))}
      </Flex>
    </Flex >
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
