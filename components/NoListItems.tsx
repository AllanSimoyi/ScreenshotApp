import { Text, VStack } from "native-base";

interface Props {
  children: string;
}

export function NoListItems (props: Props) {
  const { children } = props;
  return (
    <VStack justifyContent={"center"} alignItems="center" py={8} flexGrow={1}>
      <Text color="white" fontSize={"lg"}>
        {children}
      </Text>
    </VStack>
  )
}