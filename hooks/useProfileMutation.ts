import { useMutation } from 'react-query';
import { postRequest } from '../lib/post-request';
import { URL_PREFIX } from '../lib/url-prefix';
import { User } from '../lib/users';
import { UpdateProfile } from '../lib/validations';

interface Props {
  onMutate: (input: UpdateProfile) => void;
  onSuccess: (updatedUser: User | undefined) => void;
  onError: (error: unknown) => void;
  onSettled: () => void;
}

export function useProfileMutation (props: Props) {
  const { onMutate, onSuccess, onError, onSettled } = props;
  return useMutation(async (input: UpdateProfile) => {
    const [result, err] = await postRequest<{ user: User; errorMessage: string }>(URL_PREFIX + "/api/update-profile", input);
    if (err) {
      throw err;
    }
    if (result?.errorMessage) {
      throw new Error(result?.errorMessage);
    }
    return result?.user || undefined;
  }, {
    onMutate,
    onSuccess,
    onError,
    onSettled,
  });
}