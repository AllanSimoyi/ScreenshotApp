import { VStack } from 'native-base';

interface Props {
  children: React.ReactNode;
}

export function FullScreenCentered (props: Props) {
  const { children } = props;
  return (
    <VStack justifyContent="center" alignItems="center" py={2} style={{ height: "100%" }}>
      {children}
    </VStack>
  )
}