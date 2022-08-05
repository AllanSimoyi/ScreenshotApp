import { ImageBackground, ImageBackgroundProps } from "react-native";
import { getImageSource } from "../lib/image-rendering";

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
      accessibilityLabel="Feed Banner"
      {...restOfProps}
    >
      {children}
    </ImageBackground>
  )
}