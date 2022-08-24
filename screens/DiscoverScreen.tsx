import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { FlatList, Flex, HStack, Icon, IconButton, Input, VStack } from 'native-base';
import { useCallback, useEffect, useState } from "react";
import { CustomError } from "../components/CustomError";
import { CustomHighlight } from "../components/CustomHighlight";
import { CustomImageBackground } from "../components/CustomImageBackground";
import { CustomSkeletons } from "../components/CustomSkeletons";
import { ShadowedText } from "../components/ShadowedText";
import { usePosts } from "../hooks/usePosts";
import { getImageSource } from "../lib/image-rendering";
import { abuseCategory, categoryOptions, postHasSearchString } from '../lib/posts';
import { RootTabScreenProps } from '../types';

export default function DiscoverScreen (props: RootTabScreenProps<'Discover'>) {
  const { route } = props;
  const initialCategory = route.params?.category || abuseCategory;
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(initialCategory || abuseCategory);
  const { refetch, ...query } = usePosts('discover');
  useEffect(() => setCategory(initialCategory), [initialCategory]);
  const categoryItems = query.data ?
    query.data.filter(item => {
      return (item.category === category) && postHasSearchString(item, search);
    }) :
    [];
  const refetchCallback = useCallback(() => refetch(), [refetch]);
  const searchOnChange = useCallback((text: string) => setSearch(text), []);
  const categoryOnChange = useCallback((category: string) => setCategory(category), []);
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
          <IconButton
            onPress={refetchCallback} colorScheme="yellow" size="md" borderWidth={2}
            borderRadius="full" variant="outline" _icon={{ as: MaterialIcons, name: "sync" }}
          />
        </VStack>
      </HStack>
      {query.isError && (
        <CustomError retry={refetchCallback}>
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
                source={getImageSource(item.resourceUrl)}
                style={{ flex: 1, justifyContent: 'flex-end', flexGrow: 1, width: 200 }}
              >
                <VStack alignItems="flex-start" p={2}>
                  <ShadowedText>
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
        {categoryOptions.map((option) => (
          <VStack key={option} alignItems="flex-start" p={4} style={{ width: "33%" }}>
            <ShadowedText pb={2} bottomBorder={option === category} onPress={() => categoryOnChange(option)}>
              {option}
            </ShadowedText>
          </VStack>
        ))}
      </HStack>
    </VStack>
  );
}
