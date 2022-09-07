import { ScrollView } from 'native-base';
import { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import { SignInComponent } from '../components/SignInComponent';
import UploadOne from '../components/UploadOne';
import UploadThree from '../components/UploadThree';
import UploadTwo from '../components/UploadTwo';
import { useCurrentUploads } from '../components/useCurrentUploads';
import { useCurrentUser } from '../components/useCurrentUser';
import { useUploadImagePost } from '../hooks/useUploadImagePost';
import { useUploadVideoPost } from '../hooks/useUploadVideoPost';
import { UploadMode } from '../lib/posts';
import { CreatePost, CreateVideoPost } from '../lib/validations';
import { RootTabScreenProps } from '../types';

export default function UploadScreen (props: RootTabScreenProps<'Upload'>) {
  const { navigate } = props.navigation;
  const { currentUser } = useCurrentUser();
  const currentUploadsObject = useCurrentUploads();
  const [stage, setStage] = useState(1);
  const [mode, setMode] = useState<UploadMode>("Anonymously");
  const [error, setError] = useState("");

  const { handleVideoPostMutation, ...videoPostMutation } = useUploadVideoPost({
    ...currentUploadsObject,
    onSuccess: (newPost) => {
      if (newPost) {
        setStage(3);
        setTimeout(() => {
          setStage(1);
          navigate('Profile');
        }, 2000);
      } else {
        setError("Something went wrong, please try again");
      }
    },
    onError: async (error) => {
      setError(error as string);
    },
  })

  const { handleImagePostMutation, ...imagePostMutation } = useUploadImagePost({
    ...currentUploadsObject,
    onSuccess: (newPost) => {
      if (newPost) {
        setStage(3);
        setTimeout(() => {
          setStage(1);
          navigate('Profile');
        }, 2000);
      } else {
        setError("Something went wrong, please try again");
      }
    },
    onError: async (error) => {
      setError(error as string);
    },
  });

  const nextStage = useCallback((mode: UploadMode) => {
    setStage(prevState => prevState + 1);
    setMode(mode);
  }, []);

  const uploadImagePost = useCallback(async (newPost: CreatePost) => {
    try {
      const err = await handleImagePostMutation(newPost, "newPost");
      if (err) {
        throw new Error(err);
      }
    } catch (error) {
      const errorMessage = (error as any)?.message as string || "Something went wrong, please try again";
      console.error(errorMessage);
      setError(errorMessage);
    }
  }, [handleImagePostMutation]);

  const uploadVideoPost = useCallback(async (newPost: CreateVideoPost) => {
    try {
      const err = await handleVideoPostMutation(newPost, "newPost");
      if (err) {
        throw new Error(err);
      }
    } catch ({ message }) {
      const errorMessage = message as string || "Something went wrong, please try again";
      console.error(errorMessage);
      setError(errorMessage);
    }
  }, [handleVideoPostMutation]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {!currentUser.userId && (
        <SignInComponent noBack={true} />
      )}
      {Boolean(currentUser.userId) && (
        <>
          {stage === 1 && (<UploadOne nextStage={nextStage} />)}
          {stage === 2 && (
            <UploadTwo
              isUploading={imagePostMutation.isLoading || videoPostMutation.isLoading}
              mode={mode} setMode={setMode} 
              error={error} setError={setError}
              sending={imagePostMutation.isLoading || videoPostMutation.isLoading}
              uploadImagePost={uploadImagePost} uploadVideoPost={uploadVideoPost}
            />
          )}
          {stage === 3 && (<UploadThree />)}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
});