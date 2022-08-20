import dayjs from 'dayjs';
import { Button, FlatList, Flex, HStack, Text, VStack } from 'native-base';
import { useCallback, useState } from 'react';
import { RefreshControl } from 'react-native';
import { CustomError } from '../components/CustomError';
import { CustomSkeletons } from '../components/CustomSkeletons';
import { NoListItems } from '../components/NoListItems';
import { SendMessage } from '../components/send-message';
import { SignIn } from '../components/SignIn';
import { SignUp } from '../components/SignUp';
import { useMessages, useRecordMessage } from '../hooks/useMessages';
import { useProfileDetails } from '../hooks/useProfileDetails';
import { Message } from '../lib/messages';
import { RootTabScreenProps } from '../types';

export default function InboxScreen (_: RootTabScreenProps<'Inbox'>) {
  const [signInModalIsOpen, setSignInModalIsOpen] = useState(false);
  const [signUpModalIsOpen, setSignUpModalIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const { isLoading, details, setDetails, error, setError, setIsRetryToggle, } = useProfileDetails();
  const { refetch, ...query } = useMessages('messages');
  const refetchCallback = useCallback(() => refetch(), [refetch]);
  const setErrorCallback = useCallback((error: unknown) => setError(error as string), []);
  const { mutate, ...mutation } = useRecordMessage({
    onError: setErrorCallback,
    onSettled: refetchCallback
  });
  const isUserMessage = useCallback((message: Message) => {
    return message.senderId === details.userId || message.receiverId === details.userId;
  }, [details.userId]);
  const messages = details.userId ? query.data?.filter(isUserMessage) || [] : [];
  const sendMessage = useCallback(() => {
    if (message) {
      mutate({ userId: details.userId, content: message, receiverId: 123 });
    }
  }, [message, mutate]);
  const toggleRetry = useCallback(() => setIsRetryToggle(prevState => !prevState), []);
  const openSignInModal = useCallback(() => setSignInModalIsOpen(true), []);
  const openSignUpModal = useCallback(() => setSignUpModalIsOpen(true), []);
  return (
    <VStack alignItems="stretch" px={0} pb={16} style={{ height: "100%" }}>
      <HStack alignItems="center" py={2}>
        <Text bold fontSize="md" px="3" color="#fff">
          Messages
        </Text>
        <Flex flexGrow={1} />
      </HStack>
      {query.isError && (
        <CustomError retry={refetchCallback}>
          {query?.error?.message}
        </CustomError>
      )}
      {Boolean(error) && (
        <CustomError retry={toggleRetry}>
          {error}
        </CustomError>
      )}
      {(query.isLoading || isLoading) && (
        <CustomSkeletons num={4} h={20} />
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
          updateProfileDetails={setDetails}
          setIsOpen={setSignUpModalIsOpen}
          openSignInModal={openSignInModal}
        />
      )}
      {Boolean(messages) && (
        <FlatList
          data={messages}
          contentContainerStyle={{ flexGrow: 1 }}
          keyExtractor={(_, index) => index.toString()}
          refreshControl={<RefreshControl refreshing={query.isLoading} onRefresh={refetchCallback} />}
          ListEmptyComponent={<NoListItems>No messages found</NoListItems>}
          renderItem={({ item: report }) => (
            <VStack alignItems="stretch" px={4} py={2}>
              <VStack alignItems="stretch" p={2} style={{ backgroundColor: "rgba(255, 255, 255, 0.24)", borderRadius: 10 }}>
                <Text color="yellow.600" fontSize={"lg"}>
                  {report.sender.username}
                </Text>
                <Text color="white" fontSize={"md"}>
                  {report.content}
                </Text>
              </VStack>
              <HStack justifyContent="flex-end" alignItems="center" p={2}>
                <Text color="white" fontSize={"xs"}>
                  {dayjs(report.createdAt).format('hh:mm a')}
                </Text>
              </HStack>
            </VStack>
          )}
        />
      )}
      {!Boolean(details.userId) && (
        <VStack justifyContent="center" alignItems="stretch" px={4} py={2} style={{ position: "absolute", bottom: 2, left: 0, width: "100%", backgroundColor: "#000" }}>
          <Button onPress={openSignInModal} size="lg" colorScheme="yellow" variant="solid" borderRadius={10} py={4} px={6}>
            SIGN IN / CREATE ACCOUNT
          </Button>
        </VStack>
      )}
      {Boolean(details.userId) && (
        <VStack justifyContent="center" alignItems="stretch" p={2} style={{ position: "absolute", bottom: 2, left: 0, width: "100%", backgroundColor: "#000" }}>
          <SendMessage message={message} setMessage={setMessage} sendMessage={sendMessage} />
        </VStack>
      )}
    </VStack>
  );
}