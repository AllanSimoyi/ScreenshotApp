import { Pressable, VStack } from 'native-base';
import { CustomImageBackground } from '../components/CustomImageBackground';
import { ShadowedText } from '../components/ShadowedText';
import { getPostThumbnailUrl } from '../lib/cloudinary';
import { getImageSource } from '../lib/image-rendering';
import { shortenString } from '../lib/strings';
import { CustomHighlight } from './CustomHighlight';

interface Props {
  publicId?: string;
  resourceUrl: string;
  description: string;
  onPress: () => void;
  highlight?: string
}

export function PostThumbnail (props: Props) {
  const { publicId, resourceUrl, description, onPress, highlight } = props;
  return (
    <VStack alignItems="stretch" pb={1}>
      <Pressable onPress={(e) => onPress()}>
        <CustomImageBackground
          source={getImageSource(getPostThumbnailUrl(publicId, resourceUrl))}
          noImageFound={!publicId && !resourceUrl}
          style={{ flex: 1, justifyContent: 'flex-end', height: 180, width: "100%" }}
        >
          <VStack alignItems="flex-start" py={2} px={4}>
            <ShadowedText>
              {Boolean(highlight) && (
                <CustomHighlight searchString={highlight!}>
                  {shortenString(description, 100, "addEllipsis")}
                </CustomHighlight>
              )}
              {!Boolean(highlight) && shortenString(description, 100, "addEllipsis")}
            </ShadowedText>
          </VStack>
        </CustomImageBackground>
      </Pressable>
    </VStack>
  )
}