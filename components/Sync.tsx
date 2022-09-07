import * as Network from 'expo-network';
import { useCallback, useEffect, useState } from 'react';
import { useUploadImagePost } from '../hooks/useUploadImagePost';
import { useUploadVideoPost } from '../hooks/useUploadVideoPost';
import { db } from '../lib/db';
import { Post } from '../lib/posts';
import { capitalizeFirstLetter } from '../lib/strings';
import { useCurrentUploads } from './useCurrentUploads';

interface Props {
  children: React.ReactNode;
  isLoadingComplete: boolean;
}

export function Sync (props: Props) {
  const { children, isLoadingComplete } = props;
  const [retryToggle, setRetryToggle] = useState(false);
  const currentUploadsObject = useCurrentUploads();

  const { handleVideoPostMutation } = useUploadVideoPost({
    ...currentUploadsObject,
    onSuccess: (_) => { },
    onError: async (_) => { },
  })

  const { handleImagePostMutation } = useUploadImagePost({
    ...currentUploadsObject,
    onSuccess: (_) => { },
    onError: async (_) => { },
  });

  const fetchLocalPosts = useCallback(() => {
    return new Promise<[Post[], string | undefined]>((resolve) => {
      db.transaction((tx) => {
        tx.executeSql(
          `select * from posts;`, [],
          (_, { rows: { _array } }) => resolve([_array, undefined]),
        )
      }, (error) => resolve([[], error.message || "Something went wrong, please try again"])
      );
    })
  }, []);

  useEffect(() => {
    if (isLoadingComplete) {
      init();
    }
    
    const TWO_MINUTES_IN_MILLISECONDS = 60 * 2 * 1000;
    
    const interval = setInterval(() => {
      setRetryToggle(prevState => !prevState);
    }, TWO_MINUTES_IN_MILLISECONDS);

    async function init () {
      try {
        const [pendingPosts, err] = await fetchLocalPosts();
        if (err) {
          throw new Error(err);
        }
        const networkState = await Network.getNetworkStateAsync();
        if (networkState.isInternetReachable) {
          console.log("PENDING POSTS FOUND:", pendingPosts.length);
          await Promise.all(pendingPosts.map(post => {
            const { id, resourceUrl, createdAt, updatedAt, ...details } = post;
            if (capitalizeFirstLetter(post.resourceType) === "Video") {
              return handleVideoPostMutation({
                ...details,
                userId: Number(details.userId),
                uri: post.resourceUrl,
                resourceType: "Video",
                publicly: Boolean(details.publicly),
              }, undefined);
            }
            return handleImagePostMutation({
              ...details,
              userId: Number(details.userId),
              resourceBase64: post.resourceUrl,
              resourceType: "Image",
              publicly: Boolean(details.publicly),
            }, undefined);
          }));
        } else {
          throw new Error("No internet connection");
        }
      } catch ({ message }) {
        const errorMessage = JSON.stringify(message) as string || "Something went wrong, please try again";
        console.error(errorMessage);
      }
    }

    return () => clearInterval(interval);
  }, [Network.getNetworkStateAsync, handleVideoPostMutation, handleImagePostMutation, retryToggle]);
  
  return (<>{children}</>)
}