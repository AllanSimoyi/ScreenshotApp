import { Button, FormControl, Input, Modal, Text } from 'native-base';
import { useCallback, useState } from 'react';
import { useProfileMutation } from '../hooks/useProfileMutation';
import { getFromLocalStorage, saveToLocalStorage } from '../lib/local-storage';
import { User } from '../lib/users';
import { UpdateProfile, UpdateProfileSchema } from '../lib/validations';
import { CustomError } from './CustomError';
import { Loading } from './Loading';

interface Props {
  input: Input,
  isOpen: boolean;
  setIsOpen: (newState: boolean) => void;
  updateDetails: (newDetails: { username: string, phoneNumber: string }) => void;
}

type Input = UpdateProfile & {
  passwordConfirmation: string;
}

export function EditProfile (props: Props) {
  const { input, isOpen, setIsOpen, updateDetails } = props;

  const [username, setUsername] = useState(input.username || '');
  const [phoneNumber, setPhoneNumber] = useState(input.phoneNumber || '');

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleClose = useCallback(() => setIsOpen(false), []);

  const { mutate } = useProfileMutation({
    onMutate: () => setIsLoading(true),
    onSuccess: async (newCurrentUser: User | undefined) => {
      if (newCurrentUser) {
        saveToLocalStorage("CURRENT_USER_KEY", newCurrentUser.id.toString());
        updateDetails({
          username: newCurrentUser.username,
          phoneNumber: newCurrentUser.phoneNumber
        });
        setIsOpen(false);
      }
    },
    onError: (error) => setError((error as string)),
    onSettled: () => setIsLoading(false),
  });

  const handleSubmit = useCallback(async () => {
    const currentUserId = await getFromLocalStorage("CURRENT_USER_KEY");
    if (!currentUserId) {
      return setError("No currrent user data found");
    }
    if (password !== passwordConfirmation) {
      return setError("Please ensure passwords match");
    }
    const result = await UpdateProfileSchema.safeParseAsync({
      userId: Number(currentUserId),
      username,
      phoneNumber,
      password: password || undefined,
      passwordConfirmation: passwordConfirmation || undefined,
    });
    if (!result.success) {
      const errorMessage = result.error.issues
        .map(issue => `${ issue.path[0].toString() } ${ issue.message.toLowerCase() }`)
        .join(", ");
      return setError(errorMessage);
    }
    mutate({
      userId: Number(currentUserId),
      username,
      phoneNumber,
      password: password || undefined,
      passwordConfirmation: passwordConfirmation || undefined,
    });
  }, [mutate]);

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <Modal.Content maxWidth="400px">
        <Modal.CloseButton />
        <Modal.Header backgroundColor={"#333"}>
          <Text fontSize="lg" color="#fff">Edit Profile</Text>
        </Modal.Header>
        <Modal.Body backgroundColor={"#333"}>
          {!isLoading && <>
            <FormControl>
              <FormControl.Label>Username</FormControl.Label>
              <Input
                value={username} onChangeText={setUsername}
                color="white" fontSize={"md"} placeholder="Enter your username"
              />
            </FormControl>
            <FormControl mt="3">
              <FormControl.Label>PhoneNumber</FormControl.Label>
              <Input
                value={phoneNumber} onChangeText={setPhoneNumber}
                color="white" fontSize={"md"} placeholder="Enter your phone number"
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
          </>
          }
          {Boolean(error) && <CustomError retry={handleSubmit}>{error}</CustomError>}
          {isLoading && <Loading>Updating Profile...</Loading>}
        </Modal.Body>
        <Modal.Footer backgroundColor={"#333"}>
          <Button.Group space={2}>
            <Button size="lg" variant="ghost" disabled={isLoading} onPress={handleClose}>
              <Text color="#fff">Cancel</Text>
            </Button>
            <Button size="lg" bgColor="yellow.600" disabled={isLoading} onPress={handleSubmit}>
              {!isLoading && "Update"}
              {isLoading && "Updating..."}
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  )
}