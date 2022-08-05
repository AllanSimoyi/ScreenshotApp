import dayjs from 'dayjs';
import { Alert, Button, FlatList, Flex, HStack, Skeleton, Text, VStack } from 'native-base';
import { useCallback, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { SendMessage } from '../components/send-message';
import { SignIn } from '../components/SignIn';
import { SignUp } from '../components/SignUp';
import { useProfileDetails } from '../hooks/useProfileDetails';
import { getRequest } from '../lib/get-request';
import { Message, useMessages } from '../lib/messages';
import { postRequest } from '../lib/post-request';
import { URL_PREFIX } from '../lib/url-prefix';
import { CreateMessage } from '../lib/validations';
import { RootTabScreenProps } from '../types';

export default function InboxScreen (_: RootTabScreenProps<'Inbox'>) {
  const [signInModalIsOpen, setSignInModalIsOpen] = useState(false);
  const [signUpModalIsOpen, setSignUpModalIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const { isLoading, details, setDetails, error, setError, setIsRetryToggle, } = useProfileDetails();
  const query = useMessages('messages');
  const mutation = useMutation(async (newMessage: CreateMessage) => {
    const [result, err] = await postRequest<{ message: Message; errorMessage: string; }>(URL_PREFIX + "/api/messages", newMessage);
    if (err) {
      throw err;
    }
    if (result?.errorMessage) {
      throw new Error(result?.errorMessage);
    }
    return result?.message || undefined;
  }, {
    onError: (error) => {
      setError((error as any).toString());
    },
    onSettled: () => {
      query.refetch();
    }
  });
  const sendMessage = useCallback(() => {
    if (message) {
      mutation.mutate({
        userId: details.userId,
        content: message,
        receiverId: 123,
      });
    }
  }, [message, mutation]);
  const messages = details.userId ?
    query.data?.filter(message => {
      return message.senderId === details.userId ||
        message.receiverId === details.userId;
    }) || [] :
    query.data || [];
  return (
    <Flex
      direction="column"
      justify="flex-start"
      align="stretch"
      px="0"
      pb="16"
      style={{ height: "100%" }}
    >
      <Flex
        flexDirection="row"
        justifyContent="flex-start"
        alignItems="center"
        py="2">
        <Text bold fontSize="md" px="3" color="#fff">
          Messages
        </Text>
        <Flex flexGrow={1} />
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
                    {query?.error?.message}
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
        error &&
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
                    {error}
                  </Text>
                </HStack>
              </HStack>
              <Flex
                direction="column"
                justify="center"
                align="center">
                <Button borderColor="black" onPress={() => setIsRetryToggle(prevState => !prevState)} variant="outline">
                  RETRY
                </Button>
              </Flex>
            </VStack>
          </Alert>
        </Flex>
      }
      {
        (query.isLoading || isLoading) && (
          <>
            <Flex
              flexDirection="column"
              justify="flex-start"
              align="stretch"
              p="4">
              <Skeleton mb="4" h="20" rounded="10" />
              <Skeleton mb="4" h="20" rounded="10" />
              <Skeleton mb="4" h="20" rounded="10" />
              <Skeleton mb="4" h="20" rounded="10" />
            </Flex>
          </>
        )
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
          updateProfileDetails={setDetails}
          setIsOpen={setSignUpModalIsOpen}
          openSignInModal={() => setSignInModalIsOpen(true)}
        />
      }
      {
        Boolean(messages) &&
        <>
          <FlatList
            data={messages}
            renderItem={({ item: report }) => {
              return (
                <Flex
                  flexDirection="column"
                  justifyContent="flex-start"
                  alignItems="stretch"
                  p="2">
                  <Flex
                    flexDirection="column"
                    justifyContent="flex-start"
                    alignItems="stretch"
                    p="2"
                    style={{ backgroundColor: "rgba(255, 255, 255, 0.24)", borderRadius: 10 }}>
                    <Text color="yellow.600" fontSize={"lg"}>
                      {report.sender.username}
                    </Text>
                    <Text color="white" fontSize={"md"}>
                      {report.content}
                    </Text>
                  </Flex>
                  <Flex
                    flexDirection="row"
                    justifyContent="flex-end"
                    alignItems="center"
                    p="2">
                    <Text color="white" fontSize={"xs"}>
                      {dayjs(report.createdAt).format('hh:mm a')}
                    </Text>
                  </Flex>
                </Flex>
              )
            }}
            keyExtractor={(_, index) => index.toString()}
          />
        </>
      }
      {
        Boolean(details.userId) &&
        <Flex
          flexDirection="column"
          justify="center"
          align="stretch"
          p="2"
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            backgroundColor: "#000",
          }}
        >
          <SendMessage
            message={message}
            setMessage={setMessage}
            sendMessage={sendMessage}
          />
        </Flex>
      }
    </Flex>
  );
}

{/* <Popover // @ts-ignore
          placement={undefined}
          trigger={triggerProps => {
            return (
              <IconButton
                {...triggerProps}
                onPress={() => setMenuIsOpen(true)}
                size={"md"}
                variant="ghost"
                _icon={{
                  as: MaterialIcons,
                  name: "more-vert",
                  color: "coolGray.50",
                }}
              />
            )
          }}
          isOpen={menuIsOpen}
          onClose={() => setMenuIsOpen(!menuIsOpen)}>
          <Popover.Content w="56">
            <Popover.Arrow />
            <Popover.Body p={0}>
              <Flex
                flexDirection="column"
                justifyContent="flex-start"
                alignItems="stretch">
                <Flex
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="flex-start"
                  style={{ borderBottomWidth: 1, }}
                  p="2">
                  <Text>Mark All</Text>
                </Flex>
                <Flex
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="flex-start"
                  style={{ borderBottomWidth: 1, }}
                  p="2">
                  <Text>Mark All As Read</Text>
                </Flex>
                <Flex
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="flex-start"
                  p="2">
                  <Text>Starred Messages</Text>
                </Flex>
              </Flex>
            </Popover.Body>
          </Popover.Content>
        </Popover> */}

        // const [menuIsOpen, setMenuIsOpen] = useState(false);