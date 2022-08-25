import { Button, Input, Text, VStack } from 'native-base';
import React, { useCallback, useState } from 'react';
import { useSignIn } from '../hooks/useSignIn';
import { FALLBACK_ERROR_MESSAGE } from '../lib/errors';
import { CURRENT_USER_KEY, saveToLocalStorage } from '../lib/session';
import { User } from '../lib/users';
import { CustomError } from './CustomError';

interface Props {
  onSuccess: (newCurrentUser: User) => void
  noBack?: boolean
  back: () => void
}

export function SignInComponent (props: Props) {
  const { onSuccess, noBack, back } = props;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { mutate, ...mutation } = useSignIn({
    onMutate: (_) => setIsLoading(true),
    onSuccess: async (newCurrentUser: User | undefined) => {
      if (newCurrentUser) {
        saveToLocalStorage(CURRENT_USER_KEY, newCurrentUser.id.toString());
        onSuccess(newCurrentUser);
      }
    },
    onError: (_) => { },
    onSettled: () => setIsLoading(false)
  });
  const handleSubmit = useCallback(() => mutate({ username, password }), [mutate, username, password]);
  return (
    <VStack justifyContent={"center"} alignItems="stretch" style={{ height: "100%" }} p={2} space={2}>
      <VStack alignItems="center" py={2}>
        <Text bold fontSize="2xl" color="#fff">Sign In</Text>
      </VStack>
      <VStack alignItems="stretch" justifyContent="center" py={2}>
        <Text bold fontSize="md" color="#fff">Username</Text>
        <Input color="white" placeholder="Username" w="100%" value={username} onChangeText={setUsername} isDisabled={isLoading} />
      </VStack>
      <VStack alignItems="stretch" justifyContent="center" py={2}>
        <Text bold fontSize="md" color="#fff">Password</Text>
        <Input color="white" placeholder="Password" type="password" w="100%" value={password} onChangeText={setPassword} isDisabled={isLoading} />
      </VStack>
      <VStack alignItems="stretch" justifyContent="center" py={2}>
        {Boolean(mutation.isError) && (
          <CustomError retry={handleSubmit}>
            {(mutation.error as any)?.message || FALLBACK_ERROR_MESSAGE}
          </CustomError>
        )}
      </VStack>
      <VStack alignItems="stretch" justifyContent={"center"} py={2} space={2}>
        <Button onPress={handleSubmit} size="md" variant="solid" bgColor="yellow.600" isDisabled={mutation.isLoading}>
          <Text color="#000" fontWeight={"bold"} fontSize="xl">
            {mutation.isLoading && "SIGNING IN..."}
            {!mutation.isLoading && "SIGN IN"}
          </Text>
        </Button>
        {!noBack && (
          <Button onPress={back} size="md" variant="ghost" isDisabled={mutation.isLoading}>
            <Text color="yellow.600" fontWeight={"bold"} fontSize="xl">
              BACK
            </Text>
          </Button>
        )}
      </VStack>
    </VStack>
  )
}