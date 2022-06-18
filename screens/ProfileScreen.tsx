import { Ionicons } from '@expo/vector-icons';
import { setDefaultResultOrder } from 'dns/promises';
import { Button, Flex, Icon, Image, ScrollView, Text } from 'native-base';
import { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Col, Grid, Row } from "react-native-easy-grid";
import { useQuery } from 'react-query';
import { CustomError } from '../components/custom-error';
import { EditProfile } from '../components/EditProfile';
import { Loading } from '../components/loading';
import { SignIn } from '../components/SignIn';
import { SignUp } from '../components/SignUp';
import { useProfileDetails } from '../hooks/useProfileDetails';
import { getRequest } from '../lib/get-request';
import { Post, toMatrix } from '../lib/posts';
import { URL_PREFIX } from '../lib/url-prefix';
import { ProfileDetails } from '../lib/users';
import { RootTabScreenProps } from '../types';

export default function ProfileScreen ({ navigation }: RootTabScreenProps<'Profile'>) {

  const [signInModalIsOpen, setSignInModalIsOpen] = useState(false);
  const [signUpModalIsOpen, setSignUpModalIsOpen] = useState(false);
  const [editModalisOpen, setEditModalIsOpen] = useState(false);

  const {
    isLoading, details, setDetails, error, setError, setIsRetryToggle,
  } = useProfileDetails();

  const query = useQuery<Post[], Error>('posts', async () => {
    const [result, err] = await getRequest<{ posts: Post[]; errorMessage: string }>(URL_PREFIX + "/api/feed");
    if (err) {
      throw err;
    }
    if (result?.errorMessage) {
      throw new Error(result?.errorMessage);
    }

    return result?.posts || [];
  });

  const handleEditedDetails = useCallback((editedDetails: Omit<ProfileDetails, "userId">) => {
    setDetails(prevState => ({
      ...prevState,
      ...editedDetails,
    }));
  }, [setDetails]);

  const retryFetchUser = useCallback(() => {
    setError("");
    setIsRetryToggle(prevState => !prevState);
  }, [setIsRetryToggle])

  // const posts = query.data?.filter(post => post.userId === details.userId) || [];
  const posts = query.data?.filter(post => post.userId !== details.userId) || [];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {
        isLoading &&
        <Loading />
      }
      {
        Boolean(error) &&
        <CustomError retry={retryFetchUser}>
          {error}
        </CustomError>
      }
      {
        !Boolean(details.userId) && !isLoading &&
        <Flex
          direction="column"
          justify="center"
          align="center"
          py="2"
          style={{ height: "100%" }}
        >
          <Button
            size="lg"
            colorScheme="yellow"
            variant="outline"
            borderColor="#fff"
            borderWidth={1}
            borderRadius={35}
            px="6"
            onPress={() => setSignInModalIsOpen(true)}>
            <Text color="#fff" fontWeight={"bold"} fontSize="md">
              Sign In To Access Profile
            </Text>
          </Button>
        </Flex>
      }
      {
        !isLoading &&
        <SignIn
          isOpen={signInModalIsOpen}
          setIsOpen={setSignInModalIsOpen}
          updateProfileDetails={setDetails}
          openSignUpModal={() => setSignUpModalIsOpen(true)}
        />
      }
      {
        !isLoading &&
        <SignUp
          isOpen={signUpModalIsOpen}
          setIsOpen={setSignUpModalIsOpen}
          updateProfileDetails={setDetails}
          openSignInModal={() => setSignInModalIsOpen(true)}
        />
      }
      {
        Boolean(details.userId) && !isLoading &&
        <EditProfile
          input={{
            ...details,
            password: "",
            passwordConfirmation: ""
          }}
          updateDetails={handleEditedDetails}
          isOpen={editModalisOpen}
          setIsOpen={setEditModalIsOpen}
        />
      }
      {
        Boolean(details.userId) && !isLoading &&
        <Flex
          direction="column"
          justify="flex-start"
          align="stretch"
          px="0"
        >
          <Flex
            direction="column"
            justify="flex-start"
            align="stretch"
            px="0"
            py="2"
            style={{ backgroundColor: "orange" }}
          >
            <Flex
              direction="column"
              justify="center"
              align="center"
            >
              <Flex
                direction="column"
                justify="center"
                align="center"
                p="2">
                <Image
                  size={100}
                  borderRadius={100}
                  borderColor="black"
                  borderWidth="4"
                  p="4"
                  resizeMode={"cover"}
                  source={require('../assets/images/transparent_profile.png')}
                  alt="Profile"
                />
              </Flex>
              <Text fontWeight="bold" fontSize="2xl" color="black">
                {details.username}
              </Text>
              <Text fontSize="md" color="black">
                {details.phoneNumber}
              </Text>
            </Flex>
            <Flex flexGrow={1} />
            <Flex
              direction="column"
              justify="center"
              align="center"
              py="2"
            >
              <Button
                leftIcon={<Icon as={Ionicons} color="#333" name="pencil" size="md" />}
                size="lg"
                colorScheme="yellow"
                variant="outline"
                borderColor="black"
                borderWidth={1}
                borderRadius={35}
                px="6"
                onPress={() => setEditModalIsOpen(true)}>
                <Text color="black" fontWeight={"bold"} fontSize="md">
                  Edit Profile
                </Text>
              </Button>
            </Flex>
          </Flex>
          <Flex
            direction="column"
            justify="flex-start"
            align="stretch"
            py="2"
            px="2"
          >
            <Text bold fontSize="md" px="3" pt="2" color="#fff">
              {!query.isLoading && `${ posts.length } post(s) so far`}
              {query.isLoading && "Loading Posts..."}
            </Text>
            {
              query.isError &&
              <CustomError retry={() => query.refetch()}>
                {query.error.message}
              </CustomError>
            }
            {
              query.data &&
              <Flex
                direction="column"
                justify="flex-start"
                align="stretch"
                py="2"
                px="2">
                <Grid>
                  {toMatrix(posts, 3).map(row => (
                    <Row>
                      {row.map(post => (
                        <Col >
                          <Flex
                            flexDirection="column"
                            justifyContent="center"
                            alignItems="stretch"
                            p="1">
                            <Image
                              alt="Loading..."
                              backgroundColor="#a1a1a1"
                              borderRadius="5"
                              size={150}
                              resizeMode={"cover"}
                              source={{ uri: post.resourceUrl }}
                            />
                          </Flex>
                        </Col>
                      ))}
                    </Row>
                  ))}
                </Grid>
              </Flex>
            }
          </Flex>
        </Flex>
      }
    </ScrollView>
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
