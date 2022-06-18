import { Alert, Button, Flex, FormControl, HStack, Input, Modal, Text, VStack } from 'native-base';
import { useCallback, useState } from 'react';
import { useMutation } from 'react-query';
import { postRequest } from '../lib/post-request';
import { CURRENT_USER_KEY, saveToLocalStorage } from '../lib/session';
import { URL_PREFIX } from '../lib/url-prefix';
import { ProfileDetails, User } from '../lib/users';
import { SignInDetails, SignInSchema } from '../lib/validations';
import { CustomError } from './custom-error';
import { Loading } from './loading';

interface Props {
  isOpen: boolean;
  setIsOpen: (newState: boolean) => void;
  updateProfileDetails: (newDetails: ProfileDetails) => void;
  openSignUpModal: () => void;
}

export function SignIn (props: Props) {
  const { isOpen, setIsOpen, updateProfileDetails, openSignUpModal } = props;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const mutation = useMutation(async (input: SignInDetails) => {
    const [result, err] = await postRequest<{ user: User; errorMessage: string }>(URL_PREFIX + "/api/custom-sign-in", input);
    if (err) {
      throw err;
    }
    if (result?.errorMessage) {
      throw new Error(result?.errorMessage);
    }
    return result?.user || undefined;
  }, {
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: async (newCurrentUser: User | undefined) => {
      if (newCurrentUser) {
        saveToLocalStorage(CURRENT_USER_KEY, newCurrentUser.id.toString());
        setIsOpen(false);
        updateProfileDetails({
          userId: newCurrentUser.id,
          username: newCurrentUser.username,
          phoneNumber: newCurrentUser.phoneNumber,
        });
      }
    },
    onError: (error) => {
      setError((error as any).toString());
    },
    onSettled: () => {
      setIsLoading(false);
    }
  });

  const submitFn = useCallback(async () => {
    setError("");
    const result = await SignInSchema.safeParseAsync({
      username,
      password,
    });
    if (!result.success) {
      return setError(result.error.issues.map(issue => issue.path[0].toString() + " " + issue.message.toLowerCase()).join(", "));
    }
    mutation.mutate({
      username,
      password,
    });
  }, [mutation]);

  const createAccountAction = useCallback(() => {
    setIsOpen(false);
    openSignUpModal();
  }, [setIsOpen, openSignUpModal]);

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <Modal.Content maxWidth="400px">
        <Modal.CloseButton />
        <Modal.Header backgroundColor={"#333"}>
          <Text fontSize="lg" color="#fff">Sign In</Text>
        </Modal.Header>
        <Modal.Body backgroundColor={"#333"}>
          {
            isLoading &&
            <Loading>Signing In...</Loading>
          }
          {
            !isLoading &&
            <>
              <FormControl>
                <FormControl.Label>Username</FormControl.Label>
                <Input
                  color="white"
                  fontSize={"md"}
                  value={username}
                  onChangeText={setUsername}
                  placeholder="Enter your username"
                />
              </FormControl>
              <FormControl mt="3">
                <FormControl.Label>Password</FormControl.Label>
                <Input
                  type="password"
                  color="white"
                  fontSize={"md"}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                />
              </FormControl>
              <Flex
                flexDirection="column"
                justify="center"
                align="center"
                p="4">
                <Button size="sm" variant="link" onPress={createAccountAction}>
                  <Text color="yellow.600" textAlign="center">
                    Don't have an account? Tap here to create one
                  </Text>
                </Button>
              </Flex>
            </>
          }
          {
            error &&
            <CustomError retry={submitFn}>{error}</CustomError>
          }
        </Modal.Body>
        <Modal.Footer backgroundColor={"#333"}>
          <Button.Group space={2}>
            <Button
              size="md"
              variant="ghost"
              disabled={isLoading}
              onPress={() => setIsOpen(false)}>
              <Text color="#fff">Cancel</Text>
            </Button>
            <Button
              size="md"
              bgColor="yellow.600"
              disabled={isLoading}
              onPress={submitFn}>
              {!isLoading && "Sign In"}
              {isLoading && "Signing In..."}
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  )
}
