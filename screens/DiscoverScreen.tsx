import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { FlatList, Flex, HStack, Icon, IconButton, Input, VStack } from 'native-base';
import { useEffect, useState } from "react";
import { CustomError } from "../components/custom-error";
import { CustomHighlight } from "../components/custom-highlight";
import { CustomImageBackground } from "../components/CustomImageBackground";
import { CustomSkeletons } from "../components/CustomSkeletons";
import { ShadowedText } from "../components/ShadowedText";
import { usePosts } from "../hooks/usePosts";
import { getImageSource } from "../lib/image-rendering";
import { postHasSearchString } from '../lib/posts';
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

export default function DiscoverScreen ({ navigation, route }: RootTabScreenProps<'Discover'>) {
  const initialCategory = route.params?.category || abuseCategory.category;
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(initialCategory || abuseCategory.category);
  const query = usePosts('discover');
  const categoryItems = query.data ?
    query.data.filter(item => {
      return (item.category === category) &&
        postHasSearchString(item, search);
    }) :
    [];
  useEffect(() => {
    setCategory(initialCategory);
  }, [initialCategory]);
  return (
    <VStack alignItems="stretch" style={{ height: "100%" }}>
      <HStack alignItems="center">
        <VStack justifyContent="center" alignItems="stretch" p={2} style={{ flexGrow: 1 }} width="70%">
          <Input
            size="xl" width="100%" value={search}
            borderWidth="2" fontWeight="bold" variant="rounded"
            color="yellow.600" placeholder="Search" my="2" py="1" px="4"
            borderColor="yellow.600" onChangeText={(text) => setSearch(text)}
            InputRightElement={<Icon mx="2" size="6" color="yellow.600" as={<Ionicons name="ios-search" />} />}
          />
        </VStack>
        <VStack justifyContent={"center"} alignItems="center" p={2}>
          <IconButton
            colorScheme="yellow" size="md" borderWidth={2} borderRadius="full" variant="outline"
            onPress={() => query.refetch()}
            _icon={{ as: MaterialIcons, name: "sync" }}
          />
        </VStack>
      </HStack>
      {query.isError && (
        <CustomError retry={() => query.refetch()}>
          {query.error.message}
        </CustomError>
      )}
      {query.isLoading && <CustomSkeletons num={4} />}
      <FlatList
        horizontal={true}
        data={categoryItems}
        flexGrow={1}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <VStack alignItems="stretch" p={2}>
            <VStack alignItems="stretch" style={{ height: "100%" }}>
              <CustomImageBackground
                source={getImageSource(item.resourceUrl, "../assets/images/image_placeholder.jpeg")}
                style={{ flex: 1, justifyContent: 'flex-end', flexGrow: 1, width: 200, }}
              >
                <VStack alignItems="flex-start" p={2}>
                  <ShadowedText
                    onPress={() => {
                      navigation.navigate('Discover', { category: item.category });
                    }}>
                    <CustomHighlight searchString={search}>
                      {item.description || "..."}
                    </CustomHighlight>
                  </ShadowedText>
                </VStack>
              </CustomImageBackground>
            </VStack>
          </VStack>
        )}
      />
      <Flex flexGrow={1} />
      <HStack justifyContent={"center"} alignItems="stretch">
        {categoryOptions.map((option, index) => (
          <VStack key={index} alignItems="flex-start" p={4} style={{ width: "33%" }}>
            <ShadowedText
              pb={2}
              bottomBorder={category === option.category}
              // onPress={() => {
              //   navigation.navigate('Discover', { category: option.category });
              // }}
              onPress={() => setCategory(option.category)}
            >
              {option.category}
            </ShadowedText>
          </VStack>
        ))}
      </HStack>
    </VStack>
  );
}
