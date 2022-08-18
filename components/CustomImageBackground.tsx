import { ImageBackground, ImageBackgroundProps } from "react-native";

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
      {...restOfProps}
    >
      {children}
    </ImageBackground>
  )
}