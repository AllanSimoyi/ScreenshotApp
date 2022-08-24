import { CloudConfig, CloudinaryImage } from "@cloudinary/url-gen";
import { thumbnail } from "@cloudinary/url-gen/actions/resize";

export function getPostThumbnailUrl (publicId: string | undefined, imageUrl: string) {
  if (!publicId) {
    return imageUrl;
  }
  let myImage = new CloudinaryImage(publicId, new CloudConfig({ cloudName: 'dv2mivpiz' }));
  myImage
    .resize(thumbnail().width("100%").height(250))
    .format('auto')
    .quality('auto');
  return myImage.toURL();
}