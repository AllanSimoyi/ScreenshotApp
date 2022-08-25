import { Button, Flex, FormControl, Input, Modal, Text } from 'native-base';
import { useCallback, useState } from 'react';
import { useSignIn } from '../hooks/useSignIn';
import { CURRENT_USER_KEY, saveToLocalStorage } from '../lib/session';
import { ProfileDetails, User } from '../lib/users';
import { SignInSchema } from '../lib/validations';
import { CustomError } from './CustomError';
import { Loading } from './Loading';

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

  const { mutate } = useSignIn({
    onMutate: () => setIsLoading(true),
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
    onError: (error) => setError((error as string)),
    onSettled: () => setIsLoading(false)
  })

  const handleSubmit = useCallback(async () => {
    setError("");
    console.log(username, password);
    const result = await SignInSchema.safeParseAsync({ username, password });
    if (!result.success) {
      const errorMessage = result.error.issues
        .map(issue => `${issue.path[0].toString()} ${issue.message.toLowerCase()}`)
        .join(", ");
      return setError(errorMessage);
    }
    mutate({ username, password });
  }, [mutate]);

  const onPasswordChange = useCallback((text: string) => {
    console.log("Password chars", text);
    setPassword(text);
    setTimeout(() => console.log("New Password", password), 1000);
  }, []);

  const createAccountAction = useCallback(() => {
    setIsOpen(false);
    openSignUpModal();
  }, [setIsOpen, openSignUpModal]);

  const handleClose = useCallback(() => setIsOpen(false), [setIsOpen]);

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <Modal.Content maxWidth="400px">
        <Modal.CloseButton />
        <Modal.Header backgroundColor={"#333"}>
          <Text fontSize="lg" color="#fff">Sign In</Text>
        </Modal.Header>
        <Modal.Body backgroundColor={"#333"}>
          {isLoading && <Loading>Signing In...</Loading>}
          {!isLoading && (
            <>
              <FormControl>
                <FormControl.Label>Username</FormControl.Label>
                <Input
                  value={username} onChangeText={setUsername}
                  color="white" fontSize={"md"} placeholder="Enter your username"
                />
              </FormControl>
              <FormControl mt="3">
                <FormControl.Label>Password</FormControl.Label>
                <Input
                  value={password} onChangeText={onPasswordChange}
                  type="password" color="white" fontSize={"md"} placeholder="Enter your password"
                />
              </FormControl>
              <Flex flexDirection="column" justify="center" align="center" p="4">
                <Button size="sm" variant="link" onPress={createAccountAction}>
                  <Text color="yellow.600" textAlign="center">
                    Don't have an account? Tap here to create one
                  </Text>
                </Button>
              </Flex>
            </>
          )}
          {error && <CustomError retry={handleSubmit}>{error}</CustomError>}
        </Modal.Body>
        <Modal.Footer backgroundColor={"#333"}>
          <Button.Group space={2}>
            <Button size="md" variant="ghost" disabled={isLoading} onPress={handleClose}>
              <Text color="#fff">Cancel</Text>
            </Button>
            <Button size="md" bgColor="yellow.600" disabled={isLoading} onPress={handleSubmit}>
              {!isLoading && "Sign In"}
              {isLoading && "Signing In..."}
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  )
}
