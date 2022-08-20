import { VStack } from 'native-base';
import { useCallback, useState } from 'react';
import UploadOne from '../components/UploadOne';
import UploadThree from '../components/UploadThree';
import UploadTwo from '../components/UploadTwo';
import { usePostMutation } from '../hooks/usePostMutation';
import { CreatePost } from '../lib/validations';
import { RootTabScreenProps } from '../types';

export default function UploadScreen (props: RootTabScreenProps<'Upload'>) {
  const { navigate } = props.navigation;
  const [stage, setStage] = useState(1);
  const [mode, setMode] = useState("Anonymously");
  const [error, setError] = useState("");
  const { mutate, ...mutation } = usePostMutation({
    onSuccess: () => {
      setStage(3);
      setTimeout(() => {
        setStage(1);
        navigate('Discover', { category: undefined });
      }, 2000);
    },
    onError: (error) => setError((error as string))
  });
  const nextStage = useCallback((mode: string) => {
    setStage(prevState => prevState + 1);
    setMode(mode);
  }, []);
  const sendMessage = useCallback((newPost: CreatePost) => mutate(newPost), [mutate]);
  return (
    <VStack alignItems="stretch">
      {stage === 1 && (<UploadOne nextStage={nextStage} />)}
      {stage === 2 && (
        <UploadTwo mode={mode} sending={mutation.isLoading} sendMessage={sendMessage} error={error} setError={setError} />
      )}
      {stage === 3 && (<UploadThree />)}
    </VStack>
  );
}
