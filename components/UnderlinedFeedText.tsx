import { Text } from "native-base";

interface Props {
  onPress: () => void;
  children: React.ReactNode;
}

export function UnderlinedFeedText (props: Props) {
  const {onPress, children} = props;
  return (
    <Text
      fontSize="lg"
      fontWeight="bold"
      color="#fff"
      borderBottomWidth={2}
      borderBottomColor={"orange.400"}
      onPress={onPress}
      style={{
        textShadowColor: 'rgba(0, 0, 0, 0.95)',
        textShadowOffset: { width: -2, height: 2 },
        textShadowRadius: 20,
      }}>
      {children}
    </Text>
  )
}