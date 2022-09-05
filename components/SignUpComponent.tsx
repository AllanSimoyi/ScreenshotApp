import { Button, Input, Text, VStack } from 'native-base';
import React, { useCallback, useState } from 'react';
import { useCreateAccount } from '../hooks/useCreateAccount';
import { FALLBACK_ERROR_MESSAGE } from '../lib/errors';
import { User } from '../lib/users';
import { CustomError } from './CustomError';
import { CustomPassword } from './CustomPassword';
import { useCurrentUser } from './useCurrentUser';

interface Props {
  onSuccess?: (newCurrentUser: User) => void
  noBack?: boolean
  back?: () => void
  openSignIn: () => void;
}

export function SignUpComponent (props: Props) {
  const { onSuccess, noBack, back, openSignIn } = props;
  const { updateCurrentUser } = useCurrentUser();
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const { mutate, ...mutation } = useCreateAccount({
    onMutate: () => {
      if (password !== passwordConfirmation) {
        throw new Error("Please ensure passwords match");
      }
    },
    onSuccess: async (newCurrentUser: User | undefined) => {
      if (newCurrentUser) {
        updateCurrentUser({
          userId: newCurrentUser.id,
          username: newCurrentUser.username,
          phoneNumber: newCurrentUser.phoneNumber,
        });
        if (onSuccess) {
          onSuccess(newCurrentUser);
        }
      }
    },
    onError: (_) => { },
    onSettled: () => { }
  });
  const handleSubmit = useCallback(() => {
    mutate({ username, password, phoneNumber, role: "Normal" });
  }, [mutate, username, password]);
  return (
    <VStack justifyContent={"center"} alignItems="stretch" style={{ height: "100%" }} p={2} space={2}>
      <VStack alignItems="center" py={2}>
        <Text bold fontSize="2xl" color="#fff">Create Account</Text>
      </VStack>
      <VStack alignItems="stretch" justifyContent="center" py={2}>
        <Text bold fontSize="md" color="#fff">Username</Text>
        <Input color="white" placeholder="Username" w="100%" value={username} onChangeText={setUsername} isDisabled={mutation.isLoading} />
      </VStack>
      <VStack alignItems="stretch" justifyContent="center" py={2}>
        <Text bold fontSize="md" color="#fff">Phone Number (Optional)</Text>
        <Input color="white" placeholder="Phone Number" w="100%" value={phoneNumber} onChangeText={setPhoneNumber} isDisabled={mutation.isLoading} />
      </VStack>
      <VStack alignItems="stretch" justifyContent="center" py={2}>
        <Text bold fontSize="md" color="#fff">Password</Text>
        <CustomPassword color="white" placeholder="Password" type="password" w="100%" value={password} onChangeText={setPassword} isDisabled={mutation.isLoading} />
      </VStack>
      <VStack alignItems="stretch" justifyContent="center" py={2}>
        <Text bold fontSize="md" color="#fff">Re-Enter Password</Text>
        <CustomPassword color="white" placeholder="Re-enter Password" type="password" w="100%" value={passwordConfirmation} onChangeText={setPasswordConfirmation} isDisabled={mutation.isLoading} />
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
            {mutation.isLoading && "CREATING ACCOUNT..."}
            {!mutation.isLoading && "CREATE ACCOUNT"}
          </Text>
        </Button>
        {!noBack && Boolean(back) && (
          <Button onPress={back} size="md" variant="ghost" isDisabled={mutation.isLoading}>
            <Text color="yellow.600" fontWeight={"bold"} fontSize="xl">
              BACK
            </Text>
          </Button>
        )}
        <Button size="md" variant="ghost" onPress={openSignIn} isDisabled={mutation.isLoading}>
          <Text color="yellow.600">ALREADY HAVE AN ACCOUNT</Text>
        </Button>
      </VStack>
    </VStack>
  )
}