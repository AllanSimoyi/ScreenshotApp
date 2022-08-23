import { CloudConfig, CloudinaryImage, URLConfig } from "@cloudinary/url-gen";
import { thumbnail } from "@cloudinary/url-gen/actions/resize";

export function createPostThumbnail (imageUrl: string) {
  let cloudConfig = new CloudConfig({ cloudName: 'demo' });
  let urlConfig = new URLConfig({ secure: true });
  let myImage = new CloudinaryImage(imageUrl, cloudConfig, urlConfig);
  myImage.resize(thumbnail().width("100%").height(250));
  return myImage;
}