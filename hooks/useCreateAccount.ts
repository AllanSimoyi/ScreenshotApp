import { useMutation } from 'react-query';
import { postRequest } from '../lib/post-request';
import { URL_PREFIX } from '../lib/url-prefix';
import { User } from '../lib/users';
import { SignUpDetails } from '../lib/validations';

interface Props {
  onMutate: () => void;
  onSuccess: (newUser: User | undefined) => void;
  onError: (error: unknown) => void;
  onSettled: () => void;
}

export function useCreateAccount (props: Props) {
  const { onMutate, onSuccess, onError, onSettled } = props;
  return useMutation(async (input: SignUpDetails) => {
    const [result, err] = await postRequest<{ user: User; errorMessage: string; }>(URL_PREFIX + "/api/users", input);
    if (err) {
      throw err;
    }
    if (result?.errorMessage) {
      throw new Error(result?.errorMessage);
    }
    return result?.user || undefined;
  }, { onMutate, onSuccess, onError, onSettled });
}