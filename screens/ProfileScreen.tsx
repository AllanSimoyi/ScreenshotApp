import { Button, FlatList, Flex, HStack, Image, Pressable, ScrollView, Text, VStack } from 'native-base';
import { useCallback, useState } from 'react';
import { RefreshControl, StyleSheet } from 'react-native';
import { CustomError } from '../components/CustomError';
import { CustomHighlight } from '../components/CustomHighlight';
import { CustomImageBackground } from '../components/CustomImageBackground';
import { CustomSkeletons } from '../components/CustomSkeletons';
import { EditProfile } from '../components/EditProfile';
import { FlatListFooter } from '../components/FlatListFooter';
import { NoListItems } from '../components/NoListItems';
import { ShadowedText } from '../components/ShadowedText';
import { SignInComponent } from '../components/SignInComponent';
import { useCurrentUser } from '../components/useCurrentUser';
import { useInfinitePosts } from '../hooks/useInfinitePosts';
import { flattenArrays } from '../lib/arrays';
import { getPostThumbnailUrl } from '../lib/cloudinary';
import { getImageSource } from '../lib/image-rendering';
import { Post } from '../lib/posts';
import { capitalizeFirstLetter, shortenString } from '../lib/strings';
import { ProfileDetails } from '../lib/users';
import { RootTabScreenProps } from '../types';

export default function ProfileScreen ({ navigation: { navigate } }: RootTabScreenProps<'Profile'>) {
  const [editModalisOpen, setEditModalIsOpen] = useState(false);
  const { currentUser, updateCurrentUser } = useCurrentUser();
  const { fetchNextPage, refetch: refetchPosts, ...postsQuery } = useInfinitePosts('profile', currentUser.userId);
  const refetchPostsCallback = useCallback(() => refetchPosts(), [refetchPosts]);
  const handleEditedDetails = useCallback((editedDetails: Omit<ProfileDetails, "userId">) => {
    updateCurrentUser({
      userId: currentUser?.userId || 0,
      ...editedDetails,
    });
  }, [updateCurrentUser]);
  const openEditModal = useCallback(() => setEditModalIsOpen(true), []);
  const handleSignIn = useCallback(() => {
    updateCurrentUser({ userId: 0, username: "", phoneNumber: "" });
  }, [updateCurrentUser]);
  const posts = flattenArrays(postsQuery.data?.pages || [] as Post[][]);
  const onEndReached = useCallback(() => fetchNextPage(), [fetchNextPage]);
  const navigateToPostDetail = useCallback((post: Post) => {
    navigate('PostDetail', { post });
  }, [navigate]);
  return (
    <VStack alignItems="stretch" h="100%">
      {!Boolean(currentUser.userId) && (
        <SignInComponent noBack={true} />
      )}
      {Boolean(currentUser.userId) && (
        <EditProfile
          input={{ ...currentUser, password: "", passwordConfirmation: "" }}
          updateDetails={handleEditedDetails}
          isOpen={editModalisOpen}
          setIsOpen={setEditModalIsOpen}
        />
      )}
      {Boolean(currentUser.userId) && (
        <VStack alignItems="stretch">
          <VStack alignItems="stretch" py={2} style={{ backgroundColor: "orange" }}>
            <VStack justifyContent="center" alignItems="center">
              {/* <VStack justifyContent="center" alignItems="center" p={2}>
                <Image
                  size={50} p="4" alt="Profile" resizeMode={"cover"}
                  borderRadius={100} borderColor="black" borderWidth="4"
                  source={require('../assets/images/transparent_profile.png')}
                />
              </VStack> */}
              <Text fontWeight="bold" fontSize="2xl" color="black">{capitalizeFirstLetter(currentUser.username)}</Text>
              <Text fontSize="md" color="black">{currentUser.phoneNumber}</Text>
            </VStack>
            <Flex flexGrow={1} />
            <HStack justifyContent="center" alignItems="center" p={2} space={4}>
              <Button onPress={openEditModal} size="md" colorScheme="yellow" variant="outline" borderColor="black" borderWidth={1}>
                <Text color="black" fontWeight={"bold"} fontSize="md">
                  Edit Profile
                </Text>
              </Button>
              <Button onPress={handleSignIn} size="md" colorScheme="yellow" variant="outline" borderColor="black" borderWidth={1}>
                <Text color="black" fontWeight={"bold"} fontSize="md">
                  Log Out
                </Text>
              </Button>
            </HStack>
          </VStack>
          <VStack alignItems="stretch" p={2}>
            <Text bold fontSize="md" px="3" pt={2} pb="4" color="#fff">
              {/* {!postsQuery.isLoading && `${ posts.length } post(s) so far`} */}
              {!postsQuery.isLoading && `Posts History`}
              {postsQuery.isLoading && "Loading Posts..."}
            </Text>
            {postsQuery.isLoading && <CustomSkeletons num={4} />}
            {postsQuery.isError && (
              <CustomError retry={refetchPostsCallback}>
                {postsQuery.error.message}
              </CustomError>
            )}
            {postsQuery.data?.pages && (
              <VStack pb={12}>
                <FlatList
                  data={posts}
                  keyExtractor={(_, index) => index.toString()}
                  contentContainerStyle={{ flexGrow: 1 }}
                  refreshControl={<RefreshControl refreshing={postsQuery.isLoading} onRefresh={refetchPostsCallback} />}
                  ListEmptyComponent={<NoListItems>No posts found</NoListItems>}
                  ListFooterComponent={<FlatListFooter isEmptyList={!posts.length} listName="Feed" isLoadingMore={postsQuery.isFetchingNextPage} atEndOfList={!postsQuery.hasNextPage} />}
                  onEndReached={onEndReached}
                  onEndReachedThreshold={0.2}
                  renderItem={({ item }) => (
                    <VStack alignItems="stretch" pb={1}>
                      <Pressable onPress={(e) => navigateToPostDetail(item)}>
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
                      </Pressable>
                    </VStack>
                  )}
                />
              </VStack>
            )}
          </VStack>
        </VStack>
      )}
    </VStack>
  );
}