import { Flex } from 'native-base';

interface Props {
  children: React.ReactNode;
}

export function FullScreenCentered (props: Props) {
  const { children } = props;
  return (
    <Flex
      direction="column"
      justify="center"
      align="center"
      py="2"
      style={{ height: "100%" }}
    >
      {children}
    </Flex>
  )
}