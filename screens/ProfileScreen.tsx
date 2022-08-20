import { Ionicons } from '@expo/vector-icons';
import { Button, Flex, Icon, Image, ScrollView, Text, VStack } from 'native-base';
import { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Col, Grid, Row } from "react-native-easy-grid";
import { CustomError } from '../components/CustomError';
import { EditProfile } from '../components/EditProfile';
import { Loading } from '../components/loading';
import { SignIn } from '../components/SignIn';
import { SignUp } from '../components/SignUp';
import { usePosts } from "../hooks/usePosts";
import { useProfileDetails } from '../hooks/useProfileDetails';
import { getImageSource } from "../lib/image-rendering";
import { toMatrix } from '../lib/posts';
import { ProfileDetails } from '../lib/users';
import { RootTabScreenProps } from '../types';

export default function ProfileScreen ({ }: RootTabScreenProps<'Profile'>) {
  const [signInModalIsOpen, setSignInModalIsOpen] = useState(false);
  const [signUpModalIsOpen, setSignUpModalIsOpen] = useState(false);
  const [editModalisOpen, setEditModalIsOpen] = useState(false);
  const { isLoading, details, setDetails, error, setError, setIsRetryToggle } = useProfileDetails();
  const { refetch, ...query } = usePosts("profile");
  const refetchCallback = useCallback(() => refetch(), [refetch]);
  const handleEditedDetails = useCallback((editedDetails: Omit<ProfileDetails, "userId">) => {
    setDetails(prevState => ({
      ...prevState,
      ...editedDetails,
    }));
  }, [setDetails]);
  const retryFetchUser = useCallback(() => {
    setError("");
    setIsRetryToggle(prevState => !prevState);
  }, [setIsRetryToggle]);
  const openSignInModal = useCallback(() => setSignInModalIsOpen(true), []);
  const openSignUpModal = useCallback(() => setSignUpModalIsOpen(true), []);
  const openEditModal = useCallback(() => setEditModalIsOpen(true), []);
  const posts = query.data?.filter(post => post.userId !== details.userId) || [];
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {isLoading && (
        <Loading />
      )}
      {Boolean(error) && (
        <CustomError retry={retryFetchUser}>
          {error}
        </CustomError>
      )}
      {!Boolean(details.userId) && !isLoading && (
        <VStack justifyContent="center" alignItems="center" py={2} style={{ height: "100%" }}>
          <Button size="lg" px="6" colorScheme="yellow" variant="outline" borderColor="#fff"
            borderWidth={1} borderRadius={35} onPress={openSignInModal}>
            <Text color="#fff" fontWeight={"bold"} fontSize="md">
              Sign In To Access Profile
            </Text>
          </Button>
        </VStack>
      )}
      {!isLoading && (
        <SignIn
          isOpen={signInModalIsOpen}
          setIsOpen={setSignInModalIsOpen}
          updateProfileDetails={setDetails}
          openSignUpModal={openSignUpModal}
        />
      )}
      {!isLoading && (
        <SignUp
          isOpen={signUpModalIsOpen}
          setIsOpen={setSignUpModalIsOpen}
          updateProfileDetails={setDetails}
          openSignInModal={openSignUpModal}
        />
      )}
      {Boolean(details.userId) && !isLoading && (
        <EditProfile
          input={{ ...details, password: "", passwordConfirmation: "" }}
          updateDetails={handleEditedDetails}
          isOpen={editModalisOpen}
          setIsOpen={setEditModalIsOpen}
        />
      )}
      {Boolean(details.userId) && !isLoading && (
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
              <Text fontWeight="bold" fontSize="2xl" color="black">
                {details.username}
              </Text>
              <Text fontSize="md" color="black">
                {details.phoneNumber}
              </Text>
            </VStack>
            <Flex flexGrow={1} />
            <VStack justifyContent="center" alignItems="center" p={2}>
              <Button
                onPress={openEditModal}
                leftIcon={<Icon as={Ionicons} color="#333" name="pencil" size="md" />}
                size="lg" colorScheme="yellow" variant="outline" px="6"
                borderColor="black" borderWidth={1} borderRadius={35}>
                <Text color="black" fontWeight={"bold"} fontSize="md">
                  Edit Profile
                </Text>
              </Button>
            </VStack>
          </VStack>
          <VStack alignItems="stretch" p={2}>
            <Text bold fontSize="md" px="3" pt="2" color="#fff">
              {!query.isLoading && `${ posts.length } post(s) so far`}
              {query.isLoading && "Loading Posts..."}
            </Text>
            {query.isError && (
              <CustomError retry={refetchCallback}>
                {query.error.message}
              </CustomError>
            )}
            {query.data && (
              <VStack alignItems="stretch" p={2}>
                <Grid>
                  {toMatrix(posts, 3).map(row => (
                    <Row>
                      {row.map(post => (
                        <Col key={post.id}>
                          <VStack justifyContent={"center"} alignItems="stretch" p={1}>
                            <Image
                              alt="Loading..." backgroundColor="#a1a1a1" borderRadius="5" size={150}
                              resizeMode={"cover"} source={getImageSource(post.resourceUrl)}
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
