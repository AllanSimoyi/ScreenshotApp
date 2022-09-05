import { Text } from "native-base";
import { InterfaceTextProps } from "native-base/lib/typescript/components/primitives/Text/types";

interface Props extends InterfaceTextProps {
  onPress?: () => void;
  bottomBorder?: boolean;
  children: React.ReactNode;
}

export function ShadowedText (props: Props) {
  const { onPress, children, bottomBorder = false, ...restOfProps } = props;
  return (
    <Text fontSize="md" fontWeight="bold" onPress={onPress} color="#fff"
      style={{
        textShadowColor: 'rgba(0, 0, 0, 0.95)',
        textShadowOffset: { width: -2, height: 2 },
        textShadowRadius: 20,
      }}
      {...restOfProps}>
      {children}
    </Text>
  )
}