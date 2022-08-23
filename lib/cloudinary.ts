import { CloudConfig, CloudinaryImage } from "@cloudinary/url-gen";
import { thumbnail } from "@cloudinary/url-gen/actions/resize";

export function getPostThumbnailUrl (imageUrl: string) {
  let myImage = new CloudinaryImage(imageUrl, new CloudConfig({ cloudName: 'dv2mivpiz' }));
  myImage.resize(thumbnail().width("100%").height(250));
  return myImage.toURL();
}