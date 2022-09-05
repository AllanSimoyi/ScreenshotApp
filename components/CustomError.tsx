import { Alert, Button, HStack, Text, VStack } from 'native-base';
import { InterfaceVStackProps } from 'native-base/lib/typescript/components/primitives/Stack/VStack';

interface Props extends InterfaceVStackProps {
  retry: () => void;
  children: string;
}

export function CustomError (props: Props) {
  const { retry, children, ...restOfProps } = props;
  return (
    <VStack p={2} justifyContent="center" alignItems="stretch" borderRadius={5} {...restOfProps}>
      <Alert w="100%" status="error" variant="left-accent">
        <VStack space={2} flexShrink={1} w="100%">
          <HStack space={2} flexShrink={1} justifyContent="center" alignItems="center">
            <Alert.Icon />
            <Text fontSize="sm" fontWeight={"bold"} p="1">
              {children.toString()}
            </Text>
          </HStack>
          <VStack justifyContent="center" alignItems="stretch">
            <Button colorScheme="coolGray" onPress={retry} variant="solid" py={2} px={4}>
              RETRY
            </Button>
          </VStack>
        </VStack>
      </Alert>
    </VStack>
  )

}