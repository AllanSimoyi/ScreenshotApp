import { Ionicons } from '@expo/vector-icons';
import { Flex, Icon, Pressable, VStack } from 'native-base';
import { CustomImageBackground } from '../components/CustomImageBackground';
import { ShadowedText } from '../components/ShadowedText';
import { getPostThumbnailUrl, getVideoThumbnail } from '../lib/cloudinary';
import { getImageSource } from '../lib/image-rendering';
import { Post } from '../lib/posts';
import { capitalizeFirstLetter, shortenString } from '../lib/strings';
import { CustomHighlight } from './CustomHighlight';

interface Props {
  publicId?: string;
  resourceUrl: string;
  resourceType: Post["resourceType"];
  description: string;
  verified?: boolean;
  onPress: () => void;
  highlight?: string
}

export function PostThumbnail (props: Props) {
  const { publicId, resourceUrl, resourceType, description, onPress, highlight, verified } = props;
  const isVideo = capitalizeFirstLetter(resourceType) === "Video";
  const source = isVideo ?
    getVideoThumbnail(publicId, resourceUrl) :
    getPostThumbnailUrl(publicId, resourceUrl);
  return (
    <VStack alignItems="stretch" pb={1}>
      <Pressable onPress={(e) => onPress()}>
        <CustomImageBackground
          source={getImageSource(source)}
          noImageFound={!publicId && !resourceUrl}
          style={{ flex: 1, justifyContent: 'flex-end', height: 180, width: "100%" }}
        >
          {Boolean(verified) && (
            <VStack alignItems="flex-end" py={2} px={4}>
              <ShadowedText>Verified</ShadowedText>
            </VStack>
          )}
          <Flex flexGrow={1} />
          {isVideo && (
            <VStack justifyContent="center" alignItems="center" p={4}>
              <Icon
                as={Ionicons}
                name="play"
                size="6xl"
                style={{
                  textShadowColor: 'rgba(0, 0, 0, 0.95)',
                  textShadowOffset: { width: -2, height: 2 },
                  textShadowRadius: 20,
                } as any}
              />
            </VStack>
          )}
          <Flex flexGrow={1} />
          <VStack alignItems="flex-start" py={2} px={4}>
            <ShadowedText>
              {Boolean(highlight) && (
                <CustomHighlight searchString={highlight!}>
                  {`${ shortenString(description, 100, "addEllipsis") }${ isVideo ? " (Video)" : "" }`}
                </CustomHighlight>
              )}
              {!Boolean(highlight) && `${ shortenString(description, 100, "addEllipsis") }${ isVideo ? " (Video)" : "" }`}
            </ShadowedText>
          </VStack>
        </CustomImageBackground>
      </Pressable>
    </VStack>
  )
}