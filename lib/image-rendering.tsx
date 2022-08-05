import { ImageBackgroundProps } from "react-native";
const fallbackImage = require('../assets/images/image_placeholder.jpeg');

export function getImageSource (url: string): ImageBackgroundProps["source"] {
  if (url) {
    return { uri: url }
  }
  return fallbackImage;
}