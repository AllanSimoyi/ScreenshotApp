import { CloudConfig, CloudinaryImage, CloudinaryVideo } from "@cloudinary/url-gen";
import { thumbnail } from "@cloudinary/url-gen/actions/resize";

export function getPostThumbnailUrl (publicId: string | undefined, imageUrl: string) {
  if (!publicId) {
    return imageUrl;
  }
  let myImage = new CloudinaryImage(publicId, new CloudConfig({ cloudName: 'dv2mivpiz' }));
  myImage
    .resize(thumbnail().height(250))
    .format('auto')
    .quality('auto');
  return myImage.toURL();
}

export function getVideoThumbnail (publicId: string | undefined, imageUrl: string) {
  if (!publicId) {
    return imageUrl;
  }
  let myImage = new CloudinaryVideo(publicId, new CloudConfig({ cloudName: 'dv2mivpiz' }));
  myImage
    .format('jpg')
    .resize(thumbnail().height(250))
    .quality('auto');
  return myImage.toURL();
}