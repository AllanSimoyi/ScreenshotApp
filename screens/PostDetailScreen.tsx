import dayjs from 'dayjs';
import { ScrollView, Text, VStack } from 'native-base';
import { StyleSheet } from 'react-native';
import { CustomImageBackground } from '../components/CustomImageBackground';
import { CustomVideo } from '../components/CustomVideo';
import { getPostThumbnailUrl } from '../lib/cloudinary';
import { getImageSource } from '../lib/image-rendering';
import { capitalizeFirstLetter } from '../lib/strings';
import { RootStackScreenProps } from '../types';

export default function PostDetailScreen ({ route }: RootStackScreenProps<"PostDetail">) {
  const post = route.params?.post;
  const isVideo = post ? capitalizeFirstLetter(post.resourceType) === "Video" : false;
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {!post && (
        <Text fontSize="sm" color="#fff">Something went wrong, please restart the app</Text>
      )}
      {Boolean(post) && (
        <VStack alignItems="stretch" pb={8}>
          {!isVideo && (
            <CustomImageBackground
              source={getImageSource(getPostThumbnailUrl(post!.publicId, post!.resourceUrl))}
              borderRadius={5}
              style={{ flex: 1, justifyContent: 'flex-end', height: 300 }}>
            </CustomImageBackground>
          )}
          {isVideo && (
            <CustomVideo publicId={post!.publicId || ""} uri={post!.resourceUrl} />
          )}
          <VStack alignItems="stretch" py={2} px={4}>
            <Text fontSize="xs">Category</Text>
            <Text fontWeight="bold" fontSize="md">{capitalizeFirstLetter(post!.category)}</Text>
          </VStack>
          {Boolean(post!.description) && (
            <VStack alignItems="stretch" py={2} px={4}>
              <Text fontSize="xs">Description</Text>
              <Text fontWeight="bold" fontSize="md">{capitalizeFirstLetter(post!.description)}</Text>
            </VStack>
          )}
          <VStack alignItems="stretch" py={2} px={4}>
            <Text fontSize="xs">Posted On</Text>
            <Text fontWeight="bold" fontSize="md">{dayjs(post!.createdAt).format('DD MMM YYYY')}</Text>
          </VStack>
        </VStack>
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
