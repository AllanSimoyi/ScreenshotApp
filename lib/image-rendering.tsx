import { ImageBackgroundProps } from "react-native";

export function getImageSource (url: string, fallbackUrl: string): ImageBackgroundProps["source"] {
  if (url) {
    return { uri: url }
  }
  return require(fallbackUrl);
}