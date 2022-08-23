import { AdvancedImage } from '@cloudinary/react'
import { createPostThumbnail } from '../lib/cloudinary';

interface Props {
  imageUrl: string;
}

export function PostThumbnail (props: Props) {
  const {imageUrl} = props;
  return (
    <AdvancedImage cldImg={createPostThumbnail(imageUrl)}/>
  )
}