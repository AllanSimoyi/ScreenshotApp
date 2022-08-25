import { Alert, Button, Flex, FormControl, HStack, Input, Modal, Text, VStack } from 'native-base';
import { useCallback, useState } from 'react';
import { useMutation } from 'react-query';
import { useCreateAccount } from '../hooks/useCreateAccount';
import { postRequest } from '../lib/post-request';
import { saveToLocalStorage } from '../lib/local-storage';
import { URL_PREFIX } from '../lib/url-prefix';
import { ProfileDetails, User } from '../lib/users';
import { SignUpDetails, SignupSchema } from '../lib/validations';
import { CustomError } from './CustomError';
import { Loading } from './Loading';

interface Props {
  isOpen: boolean;
  setIsOpen: (newState: boolean) => void;
  updateProfileDetails: (newDetails: ProfileDetails) => void;
  openSignInModal: () => void;
}

type Input = SignUpDetails & {
  passwordConfirmation: string;
}

export function SignUp (props: Props) {
  const { isOpen, setIsOpen, updateProfileDetails, openSignInModal } = props;

  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { mutate } = useCreateAccount({
    onMutate: () => setIsLoading(true),
    onSuccess: async (newCurrentUser: User | undefined) => {
      if (newCurrentUser) {
        saveToLocalStorage("CURRENT_USER_KEY", newCurrentUser.id.toString());
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
  });

  const handleSubmit = useCallback(async () => {
    setError("");
    if (password !== passwordConfirmation) {
      return setError("Please ensure passwords match");
    }
    const result = await SignupSchema.safeParseAsync({ username, phoneNumber, password, role: "Normal" });
    if (!result.success) {
      const errorMessage = result.error.issues
        .map(issue => `${ issue.path[0].toString() } ${ issue.message.toLowerCase() }`)
        .join(", ");
      return setError(errorMessage);
    }
    mutate({ username, phoneNumber, password, role: "Normal" });
  }, [mutate]);

  const alreadyHaveAccountAction = useCallback(() => {
    setIsOpen(false);
    openSignInModal();
  }, [setIsOpen, openSignInModal]);

  const handleClose = useCallback(() => setIsOpen(false), [setIsOpen]);

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <Modal.Content maxWidth="400px">
        <Modal.CloseButton />
        <Modal.Header backgroundColor={"#333"}>
          <Text fontSize="lg" color="#fff">Create Account</Text>
        </Modal.Header>
        <Modal.Body backgroundColor={"#333"}>
          {isLoading && <Loading>Signing Up...</Loading>}
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
                <FormControl.Label>Phone Number (Optional)</FormControl.Label>
                <Input
                  value={phoneNumber} onChangeText={setPhoneNumber}
                  color="white" fontSize={"md"} placeholder="Enter your phone number (optional)"
                />
              </FormControl>
              <FormControl mt="3">
                <FormControl.Label>Password</FormControl.Label>
                <Input
                  value={password} onChangeText={setPassword}
                  type="password" color="white" fontSize={"md"} placeholder="Enter your password"
                />
              </FormControl>
              <FormControl mt="3">
                <FormControl.Label>Re-enter Password</FormControl.Label>
                <Input
                  value={passwordConfirmation} onChangeText={setPasswordConfirmation}
                  type="password" color="white" fontSize={"md"} placeholder="Re-enter your password"
                />
              </FormControl>
              <VStack justifyContent="center" alignItems="center" p={4}>
                <Button size="sm" variant="link" onPress={alreadyHaveAccountAction}>
                  <Text color="yellow.600">
                    Already have an account? Tap here to sign in
                  </Text>
                </Button>
              </VStack>
            </>
          )}
          {Boolean(error) && <CustomError retry={handleSubmit}>{error}</CustomError>}
        </Modal.Body>
        <Modal.Footer backgroundColor={"#333"}>
          <Button.Group space={2}>
            <Button size="lg" variant="ghost" disabled={isLoading} onPress={handleClose}>
              <Text color="#fff">Cancel</Text>
            </Button>
            <Button size="lg" bgColor="yellow.600" disabled={isLoading} onPress={handleSubmit}>
              {!isLoading && "Sign Up"}
              {isLoading && "Signing Up..."}
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  )
}
