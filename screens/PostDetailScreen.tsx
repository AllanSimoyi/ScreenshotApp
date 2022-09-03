import dayjs from 'dayjs';
import { ScrollView, Text, VStack } from 'native-base';
import { StyleSheet } from 'react-native';
import { CustomImageBackground } from '../components/CustomImageBackground';
import { getPostThumbnailUrl } from '../lib/cloudinary';
import { getImageSource } from '../lib/image-rendering';
import { capitalizeFirstLetter } from '../lib/strings';
import { RootStackScreenProps } from '../types';

export default function PostDetailScreen ({ route }: RootStackScreenProps<"PostDetail">) {
  const post = route.params?.post;
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {!post && (
        <Text fontSize="sm" color="#fff">Category</Text>
      )}
      {Boolean(post) && (
        <VStack alignItems="stretch" pb={8}>
          <CustomImageBackground
            source={getImageSource(getPostThumbnailUrl(post!.publicId, post!.resourceUrl))}
            borderRadius={5}
            style={{ flex: 1, justifyContent: 'flex-end', height: 300 }}>
          </CustomImageBackground>
          <VStack alignItems="stretch" p={2}>
            <Text fontSize="sm" color="#d1d1d1">Category</Text>
            <Text fontWeight="bold" fontSize="xl" color="#fff">{capitalizeFirstLetter(post!.category)}</Text>
          </VStack>
          {Boolean(post!.description) && (
            <VStack alignItems="stretch" p={2}>
              <Text fontSize="sm" color="#d1d1d1">Description</Text>
              <Text fontWeight="bold" fontSize="xl" color="#fff">{capitalizeFirstLetter(post!.description)}</Text>
            </VStack>
          )}
          <VStack alignItems="stretch" p={2}>
            <Text fontSize="sm" color="#d1d1d1">Posted On</Text>
            <Text fontWeight="bold" fontSize="xl" color="#fff">{dayjs(post!.createdAt).format('DD MMM YYYY')}</Text>
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
