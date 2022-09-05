import dayjs from 'dayjs';
import { FlatList, HStack, Text, VStack } from 'native-base';
import { useCallback, useState } from 'react';
import { RefreshControl } from 'react-native';
import { useQueryClient } from 'react-query';
import { CustomError } from '../components/CustomError';
import { CustomSkeletons } from '../components/CustomSkeletons';
import { FlatListFooter } from '../components/FlatListFooter';
import { NoListItems } from '../components/NoListItems';
import { SendMessage } from '../components/SendMessage';
import { SignInComponent } from '../components/SignInComponent';
import { useCurrentUser } from '../components/useCurrentUser';
import { useInfiniteMessages } from '../hooks/useInfiniteMessages';
import { useRecordMessage } from '../hooks/useMessages';
import { flattenArrays } from '../lib/arrays';
import { createOptimisticMessage, Message } from '../lib/messages';
import { capitalizeFirstLetter } from '../lib/strings';
import { CreateMessage } from '../lib/validations';
import { RootTabScreenProps } from '../types';

const queryKey = "messages";

export default function InboxScreen (_: RootTabScreenProps<'Inbox'>) {
  const [message, setMessage] = useState("");
  const { currentUser } = useCurrentUser();
  const queryClient = useQueryClient();
  const { fetchNextPage, refetch, ...query } = useInfiniteMessages(queryKey, currentUser.userId);
  const refetchCallback = useCallback(() => refetch(), [refetch]);
  const { mutate } = useRecordMessage({
    onMutate: async (newMessage: CreateMessage) => {
      setMessage("");
      await queryClient.cancelQueries([queryKey]);
      const previousMessages = queryClient.getQueryData<{ pages: Message[][] }>([queryKey]);
      queryClient.setQueryData<{ pages: Message[][] }>([queryKey], old => {
        const message = createOptimisticMessage(newMessage, currentUser);
        return old ?
          { ...old, pages: [[message, ...old.pages[0]], ...old.pages] } :
          { pages: [[message]] };
      });
      return { previousMessages }
    },
    onError: (_, __, context) => {
      queryClient.setQueryData([queryKey], context.previousMessages);
    },
    onSettled: () => queryClient.invalidateQueries([queryKey]),
  });
  const sendMessage = useCallback(() => {
    if (message) {
      mutate({ userId: currentUser.userId, content: message, receiverId: 123 });
    }
  }, [message, mutate]);
  const onEndReached = useCallback(() => fetchNextPage(), [fetchNextPage]);
  const messages = flattenArrays(query.data?.pages || [] as Message[][]);
  return (
    <VStack alignItems="stretch" px={0} style={{ height: "100%" }}>
      {!Boolean(currentUser.userId) && (
        <SignInComponent noBack={true} />
      )}
      {Boolean(currentUser.userId) && (
        <>
          {query.isError && (
            <CustomError retry={refetchCallback}>
              {query?.error?.message}
            </CustomError>
          )}
          {query.isLoading && <CustomSkeletons num={4} h={20} />}
          {query.data?.pages && (
            <FlatList
              data={messages}
              keyExtractor={(_, index) => index.toString()}
              contentContainerStyle={{ flexGrow: 1 }}
              // refreshControl={<RefreshControl refreshing={query.isLoading} onRefresh={refetchCallback} />}
              ListEmptyComponent={<NoListItems>No messages found</NoListItems>}
              ListFooterComponent={<FlatListFooter isEmptyList={!messages.length} listName={"Messages"} isLoadingMore={query.isFetchingNextPage} atEndOfList={!query.hasNextPage} />}
              onEndReached={onEndReached}
              onEndReachedThreshold={0.2}
              inverted
              renderItem={({ item: report }) => (
                <VStack alignItems="stretch" px={4} py={2}>
                  <VStack alignItems="stretch" py={2} px={2} borderRadius={10} space={1} _light={{ bgColor:"coolGray.300" }} _dark={{ bgColor:"coolGray.600" }}>
                    <Text fontSize={"xs"}>
                      {capitalizeFirstLetter(report.sender.username)}
                    </Text>
                    <Text fontSize={"md"} fontWeight="bold">
                      {report.content}
                    </Text>
                  </VStack>
                  <HStack justifyContent="flex-end" alignItems="center" px={2} py={1}>
                    <Text fontSize={"xs"}>
                      {dayjs(report.createdAt).format('hh:mm a')}
                    </Text>
                  </HStack>
                </VStack>
              )}
            />
          )}
          <VStack justifyContent="center" alignItems="stretch" py={1} px={2}>
            <SendMessage message={message} setMessage={setMessage} sendMessage={sendMessage} />
          </VStack>
        </>
      )}
    </VStack>
  );
}