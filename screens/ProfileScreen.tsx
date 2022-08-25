import { Button, Flex, HStack, Image, ScrollView, Text, VStack } from 'native-base';
import { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Col, Grid, Row } from "react-native-easy-grid";
import { CustomError } from '../components/CustomError';
import { IMAGE_DEFAULT_SOURCE } from '../components/CustomImageBackground';
import { EditProfile } from '../components/EditProfile';
import { SignInComponent } from '../components/SignInComponent';
import { useCurrentUser } from '../components/useCurrentUser';
import { usePosts } from "../hooks/usePosts";
import { getPostThumbnailUrl } from '../lib/cloudinary';
import { getImageSource } from "../lib/image-rendering";
import { toMatrix } from '../lib/posts';
import { ProfileDetails } from '../lib/users';
import { RootTabScreenProps } from '../types';

export default function ProfileScreen ({ }: RootTabScreenProps<'Profile'>) {
  const [editModalisOpen, setEditModalIsOpen] = useState(false);
  const { currentUser, updateCurrentUser } = useCurrentUser();
  const { refetch: refetchPosts, ...postsQuery } = usePosts("profile");
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
  const posts = currentUser.userId ?
    postsQuery.data?.filter(post => post.userId === currentUser?.userId) || [] :
    [];
  return (
    <ScrollView contentContainerStyle={styles.container}>
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
              <VStack justifyContent="center" alignItems="center" p={2}>
                <Image
                  size={100} p="4" alt="Profile" resizeMode={"cover"}
                  borderRadius={100} borderColor="black" borderWidth="4"
                  source={require('../assets/images/transparent_profile.png')}
                />
              </VStack>
              <Text fontWeight="bold" fontSize="2xl" color="black">{currentUser.username}</Text>
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
            <Text bold fontSize="md" px="3" pt="2" color="#fff">
              {!postsQuery.isLoading && `${ posts.length } post(s) so far`}
              {postsQuery.isLoading && "Loading Posts..."}
            </Text>
            {postsQuery.isError && (
              <CustomError retry={refetchPostsCallback}>
                {postsQuery.error.message}
              </CustomError>
            )}
            {Boolean(postsQuery.data) && (
              <VStack alignItems="stretch" p={2}>
                <Grid>
                  {toMatrix(posts, 3).map((row, index) => (
                    <Row key={index}>
                      {row.map(post => (
                        <Col key={post.id}>
                          <VStack justifyContent={"center"} alignItems="stretch" p={1}>
                            <Image
                              alt="Loading..." backgroundColor="#a1a1a1" borderRadius="5"
                              size={150} resizeMode={"cover"} defaultSource={IMAGE_DEFAULT_SOURCE}
                              source={getImageSource(getPostThumbnailUrl(post.publicId, post.resourceUrl))}
                            />
                          </VStack>
                        </Col>
                      ))}
                    </Row>
                  ))}
                </Grid>
              </VStack>
            )}
          </VStack>
        </VStack>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
});
