import { CloudConfig, CloudinaryImage, URLConfig } from "@cloudinary/url-gen";
import { thumbnail } from "@cloudinary/url-gen/actions/resize";

export function createPostThumbnail (imageUrl: string) {
  // let urlConfig = new URLConfig({ secure: true });
  try {
    // let myImage = new CloudinaryImage(imageUrl, cloudConfig, urlConfig);
    let myImage = new CloudinaryImage(imageUrl, new CloudConfig({ cloudName: 'dv2mivpiz' }));
    myImage.resize(thumbnail().width("100%").height(250));
    return myImage;
  } catch ({message}) {
    return new CloudinaryImage("i7jcvgfwi8iqlbosxrzg", new CloudConfig({ cloudName: 'dv2mivpiz' }));
  }
}