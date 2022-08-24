import { ImageBackground, ImageBackgroundProps } from "react-native";
export const IMAGE_DEFAULT_SOURCE = require("../assets/images/image_loading.gif");

interface Props extends ImageBackgroundProps {
  children: React.ReactNode;
}

export function CustomImageBackground (props: Props) {
  const { children, ...restOfProps } = props;
  return (
    <ImageBackground
      accessible
      borderRadius={10}
      resizeMode="cover"
      accessibilityLabel="Image Post"
      defaultSource={IMAGE_DEFAULT_SOURCE}
      {...restOfProps}
    >
      {children}
    </ImageBackground>
  )
}