import { Button, FlatList, Flex, HStack, Pressable, Text, useColorMode, VStack } from 'native-base';
import { useCallback, useEffect, useState } from 'react';
import { RefreshControl } from 'react-native';
import { CustomError } from '../components/CustomError';
import { CustomImageBackground } from '../components/CustomImageBackground';
import { CustomSkeletons } from '../components/CustomSkeletons';
import { EditProfile } from '../components/EditProfile';
import { FlatListFooter } from '../components/FlatListFooter';
import { LoadingText } from '../components/LoadingText';
import { NoListItems } from '../components/NoListItems';
import { PostThumbnail } from '../components/PostThumbnail';
import { ShadowedText } from '../components/ShadowedText';
import { SignInComponent } from '../components/SignInComponent';
import { useCurrentUser } from '../components/useCurrentUser';
import { useInfinitePosts } from '../hooks/useInfinitePosts';
import { flattenArrays } from '../lib/arrays';
import { getPostThumbnailUrl } from '../lib/cloudinary';
import { db } from '../lib/db';
import { getImageSource } from '../lib/image-rendering';
import { Post } from '../lib/posts';
import { capitalizeFirstLetter, shortenString } from '../lib/strings';
import { ProfileDetails } from '../lib/users';
import { RootTabScreenProps } from '../types';

export default function ProfileScreen ({ navigation: { navigate } }: RootTabScreenProps<'Profile'>) {
  const { colorMode, toggleColorMode } = useColorMode();
  const [editModalisOpen, setEditModalIsOpen] = useState(false);
  const { currentUser, updateCurrentUser, logout } = useCurrentUser();
  const [mode, setMode] = useState<"Uploaded" | "NotYetUploaded">("Uploaded");
  const { fetchNextPage, refetch: refetchPosts, ...postsQuery } = useInfinitePosts('profile', currentUser.userId);
  const [localPosts, setLocalPosts] = useState<Post[]>([]);
  const [localPostsError, setLocalPostsError] = useState("");
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [localPostsRetryToggle, setLocalPostsRetryToggle] = useState(false);
  const fetchLocalPosts = useCallback(() => {
    return new Promise<[Post[], string | undefined]>((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          `select * from posts;`, [],
          (_, { rows: { _array } }) => resolve([_array, undefined]),
        )
      }, (error) => resolve([[], error.message || "Something went wrong, please try again"])
      );
    })
  }, []);
  useEffect(() => {
    if (mode === "NotYetUploaded") {
      init();
    }
    async function init () {
      setIsLoadingPosts(true);
      const [fetchedLocalPosts, err] = await fetchLocalPosts();
      if (err) {
        return setLocalPostsError(err);
      }
      setLocalPosts(fetchedLocalPosts);
      setIsLoadingPosts(false);
    }
  }, [mode, localPostsRetryToggle]);
  const refetchPostsCallback = useCallback(() => refetchPosts(), [refetchPosts]);
  const handleEditedDetails = useCallback((editedDetails: Omit<ProfileDetails, "userId">) => {
    updateCurrentUser({
      userId: currentUser?.userId || 0,
      ...editedDetails,
    });
  }, [updateCurrentUser]);
  const openEditModal = useCallback(() => setEditModalIsOpen(true), []);
  const handleSignOut = useCallback(() => logout(), [logout]);
  const posts = flattenArrays(postsQuery.data?.pages || [] as Post[][]);
  const onEndReached = useCallback(() => fetchNextPage(), [fetchNextPage]);
  const navigateToPostDetail = useCallback((post: Post) => navigate('PostDetail', { post }), [navigate]);
  const toggleUplaoded = useCallback(() => setMode("Uploaded"), []);
  const toggleNotYetUplaoded = useCallback(() => setMode("NotYetUploaded"), []);
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
        <VStack alignItems="stretch" h="100%" pb={2}>
          <HStack justifyContent={"center"} alignItems="center" space={4} py={2}>
            <Button.Group isAttached colorScheme="coolGray">
              <Button onPress={toggleUplaoded} variant={mode === "Uploaded" ? undefined : "outline"}>
                UPLOADED POSTS
              </Button>
              <Button onPress={toggleNotYetUplaoded} variant={mode === "NotYetUploaded" ? undefined : "outline"}>
                NOT YET UPLOADED
              </Button>
            </Button.Group>
          </HStack>
          {mode === "Uploaded" && (
            <>
              {postsQuery.isLoading && <CustomSkeletons num={4} />}
              {postsQuery.isError && (
                <CustomError retry={refetchPostsCallback}>
                  {postsQuery.error.message}
                </CustomError>
              )}
              <VStack pb={12}>
                <FlatList
                  data={posts}
                  keyExtractor={(_, index) => index.toString()}
                  contentContainerStyle={{ flexGrow: 1 }}
                  refreshControl={<RefreshControl refreshing={postsQuery.isLoading} onRefresh={refetchPostsCallback} />}
                  ListEmptyComponent={<NoListItems>No posts found</NoListItems>}
                  ListFooterComponent={<FlatListFooter isEmptyList={!posts.length} listName="Profile Posts" isLoadingMore={postsQuery.isFetchingNextPage} atEndOfList={!postsQuery.hasNextPage} />}
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
            </>
          )}
          {mode === "NotYetUploaded" && (
            <>
              {isLoadingPosts && (
                <VStack justifyContent={"center"} alignItems="center" py={6}>
                  <LoadingText />
                </VStack>
              )}
              {Boolean(localPostsError) && !isLoadingPosts && (
                <CustomError retry={() => setLocalPostsRetryToggle(prevState => !prevState)}>
                  {localPostsError}
                </CustomError>
              )}
              {!isLoadingPosts && (
                <VStack pb={12}>
                  <FlatList
                    data={localPosts}
                    keyExtractor={(post) => `Local${ post.id.toString() }`}
                    contentContainerStyle={{ flexGrow: 1 }}
                    ListEmptyComponent={<NoListItems>No posts found</NoListItems>}
                    renderItem={({ item }) => <PostThumbnail {...item} onPress={() => navigateToPostDetail(item)} />}
                  />
                </VStack>
              )}
            </>
          )}
        </VStack>
      )}
    </VStack>
  );
}