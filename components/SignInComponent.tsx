import { StyleSheet } from 'react-native';
import { Button, Input, Text, VStack } from 'native-base';
import React, { useCallback, useState } from 'react';
import { ScrollView } from 'react-native';
import { useSignIn } from '../hooks/useSignIn';
import { FALLBACK_ERROR_MESSAGE } from '../lib/errors';
import { User } from '../lib/users';
import { CustomError } from './CustomError';
import { SignUpComponent } from './SignUpComponent';
import { useCurrentUser } from './useCurrentUser';
import { InterfaceVStackProps } from 'native-base/lib/typescript/components/primitives/Stack/VStack';
import { CustomPassword } from './CustomPassword';

interface Props extends InterfaceVStackProps {
  onSuccess?: (newCurrentUser: User) => void
  noBack?: boolean
  back?: () => void
}

export function SignInComponent (props: Props) {
  const { onSuccess, noBack, back, ...restOfProps } = props;
  const { login } = useCurrentUser();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [createAccountIsOpen, setCreateAccountIsOpen] = useState(false);
  const { mutate, ...mutation } = useSignIn({
    onMutate: (_) => { },
    onSuccess: async (newCurrentUser: User | undefined) => {
      if (newCurrentUser) {
        login(newCurrentUser);
        onSuccess?.(newCurrentUser);
      }
    },
    onError: (_) => { },
    onSettled: () => { }
  });
  const openCreateAccount = useCallback(() => setCreateAccountIsOpen(true), []);
  const closeCreateAccount = useCallback(() => setCreateAccountIsOpen(false), []);
  const handleSubmit = useCallback(() => mutate({ username, password }), [mutate, username, password]);
  return (
    <VStack alignItems="stretch" {...restOfProps}>
      {!createAccountIsOpen && (
        <VStack justifyContent={"center"} alignItems="stretch" style={{ height: "100%" }} p={2} space={2}>
          <VStack alignItems="center" py={2}>
            <Text bold fontSize="2xl">Sign In</Text>
          </VStack>
          <VStack alignItems="stretch" justifyContent="center" py={2}>
            <Text bold fontSize="md">Username</Text>
            <Input placeholder="Username" w="100%" value={username} onChangeText={setUsername} isDisabled={mutation.isLoading} />
          </VStack>
          <VStack alignItems="stretch" justifyContent="center" py={2}>
            <Text bold fontSize="md">Password</Text>
            <CustomPassword placeholder="Password" type="password" w="100%" value={password} onChangeText={setPassword} isDisabled={mutation.isLoading} />
          </VStack>
          <VStack alignItems="stretch" justifyContent="center" py={2}>
            {Boolean(mutation.isError) && (
              <CustomError retry={handleSubmit}>
                {(mutation.error as any)?.message || FALLBACK_ERROR_MESSAGE}
              </CustomError>
            )}
          </VStack>
          <VStack alignItems="stretch" justifyContent={"center"} py={2} space={2}>
            <Button onPress={handleSubmit} variant="solid" colorScheme="coolGray" isDisabled={mutation.isLoading}>
              {mutation.isLoading && "SIGNING IN..."}
              {!mutation.isLoading && "SIGN IN"}
            </Button>
            {!noBack && Boolean(back) && (
              <Button onPress={back} variant="ghost" colorScheme="coolGray" isDisabled={mutation.isLoading}>
                BACK
              </Button>
            )}
            <Button colorScheme={"coolGray"} variant="ghost" onPress={openCreateAccount} isDisabled={mutation.isLoading}>
              I DON'T HAVE AN ACCOUNT
            </Button>
          </VStack>
        </VStack>
      )}
      {createAccountIsOpen && (
        <SignUpComponent onSuccess={onSuccess} noBack={noBack} back={back} openSignIn={closeCreateAccount} />
      )}
    </VStack>
  )
}