import { ImageBackgroundProps } from "react-native";
export const FALLBACK_IMAGE_URI = require('../assets/images/no_image_available.jpeg');

export function getImageSource (url: string): ImageBackgroundProps["source"] {
  if (url) {
    return { uri: url }
  }
  return FALLBACK_IMAGE_URI;
}