import { ImageBackground, ImageBackgroundProps } from "react-native";
export const IMAGE_DEFAULT_SOURCE = require("../assets/images/image_loading.jpeg");

interface Props extends ImageBackgroundProps {
  children: React.ReactNode;
  noImageFound?: boolean
}

export function CustomImageBackground (props: Props) {
  const { children, noImageFound, ...restOfProps } = props;
  return (
    <ImageBackground
      accessible
      resizeMode={noImageFound ? "contain" : "cover"}
      accessibilityLabel="Image Post"
      defaultSource={IMAGE_DEFAULT_SOURCE}
      {...restOfProps}
    >
      {children}
    </ImageBackground>
  )
}