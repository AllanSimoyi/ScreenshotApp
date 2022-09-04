import { ScrollView } from 'native-base';
import { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import { SignInComponent } from '../components/SignInComponent';
import UploadOne from '../components/UploadOne';
import UploadThree from '../components/UploadThree';
import UploadTwo from '../components/UploadTwo';
import { useCurrentUser } from '../components/useCurrentUser';
import { usePostMutation } from '../hooks/usePostMutation';
import { db } from '../lib/db';
import { Post, UploadMode } from '../lib/posts';
import { CreatePost } from '../lib/validations';
import { RootTabScreenProps } from '../types';

export default function UploadScreen (props: RootTabScreenProps<'Upload'>) {
  const { navigate } = props.navigation;
  const { currentUser } = useCurrentUser();
  const [stage, setStage] = useState(1);
  const [mode, setMode] = useState<UploadMode>("Anonymously");
  const [error, setError] = useState("");
  
  const writePostToLocalDB = useCallback((post: Post) => {
    const { userId, uuid, resourceUrl, publicId, width, height, resourceType } = post;
    const { publicly, category, description, createdAt, updatedAt } = post;
    return new Promise<string>((resolve, reject) => {
      db.transaction(
        (tx) => {
          tx.executeSql(`
          insert into posts 
          (userId, uuid, resourceUrl, publicId, width, height, resourceType, 
          publicly, category, description, createdAt, updatedAt) 
          values 
          (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `, [
            userId, uuid, resourceUrl, publicId || "", width || 0, height || 0, resourceType,
            Number(publicly) || 0, category, description, createdAt.getTime().toString(), updatedAt.getTime().toString()
          ]);
        },
        (error) => reject(error.message || "Something went wrong, please try again"),
        () => resolve(""),
      );
    });
  }, []);

  const removePostFromLocalDB = useCallback((uuid: string) => {
    db.transaction((tx) => {
      tx.executeSql(`delete from posts where uuid = ?;`, [uuid])
    });
  }, []);
  
  const { mutate, ...mutation } = usePostMutation({
    onSuccess: (newPost) => {
      if (newPost) {
        removePostFromLocalDB(newPost.uuid);
        setStage(3);
        setTimeout(() => {
          setStage(1);
          navigate('Discover', { category: undefined });
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

  const sendMessage = useCallback(async (newPost: CreatePost) => {
    try {
      const post: Post = {
        ...newPost,
        id: 1,
        userId: Number(newPost.userId),
        resourceUrl: newPost.resourceBase64 || "",
        description: newPost.description || "",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      const err = await writePostToLocalDB(post);
      if (err) {
        return setError(err);
      }
      mutate(newPost);
    } catch ({ message }) {
      const errorMessage = message as string || "Something went wrong, please try again";
      console.error(errorMessage);
      setError(errorMessage);
    }
  }, [mutate]);
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
              mode={mode} setMode={setMode} sending={mutation.isLoading}
              sendMessage={sendMessage} error={error} setError={setError}
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