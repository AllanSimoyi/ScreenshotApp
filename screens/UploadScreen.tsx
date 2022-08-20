import { Flex } from 'native-base';
import { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useMutation } from 'react-query';
import UploadOne from '../components/UploadOne';
import UploadThree from '../components/UploadThree';
import UploadTwo from '../components/UploadTwo';
import { postRequest } from '../lib/post-request';
import { Post } from "../lib/posts";
import { URL_PREFIX } from '../lib/url-prefix';
import { CreatePost } from '../lib/validations';
import { RootTabScreenProps } from '../types';

export default function UploadScreen ({ navigation }: RootTabScreenProps<'Upload'>) {
  const [stage, setStage] = useState(1);
  const [mode, setMode] = useState("Anonymously");
  const [error, setError] = useState("");

  const nextStage = useCallback((mode: string) => {
    setStage(prevState => prevState + 1);
    setMode(mode);
  }, []);

  const mutation = useMutation(async (newPost: CreatePost) => {
    const [result, err] = await postRequest<{ post: Post; errorMessage: string; }>(URL_PREFIX + "/api/create-post", newPost);
    if (err) {
      throw err;
    }
    if (result?.errorMessage) {
      throw new Error(result?.errorMessage);
    }
    return result?.post || undefined;
  }, {
    onSuccess: () => {
      setStage(3);
      setTimeout(() => {
        setStage(1);
        navigation.navigate('Discover', { category: undefined });
      }, 2000);
    },
    onError: (error) => {
      setError((error as any).toString());
    }
  })

  const sendMessage = useCallback((newPost: CreatePost) => {
    mutation.mutate(newPost);
  }, [mutation]);

  return (
    <Flex
      direction="column"
      justify="flex-start"
      align="stretch"
      px="0"
    >
      {
        stage === 1 &&
        <UploadOne nextStage={nextStage} />
      }
      {
        stage === 2 &&
        <UploadTwo
          mode={mode}
          sending={mutation.isLoading}
          sendMessage={sendMessage}
          error={error}
          setError={setError}
        />
      }
      {
        stage === 3 &&
        <UploadThree />
      }
    </Flex>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
