import { Alert, Button, HStack, Text, VStack } from 'native-base';
import { InterfaceVStackProps } from 'native-base/lib/typescript/components/primitives/Stack/VStack';

interface Props extends InterfaceVStackProps {
  retry: () => void;
  children: string;
}

export function CustomError (props: Props) {
  const { retry, children, ...restOfProps } = props;
  return (
    <VStack py={2} justifyContent="center" alignItems="stretch" {...restOfProps}>
      <Alert w="100%" status="error">
        <VStack space={2} flexShrink={1} w="100%">
          <HStack space={2} flexShrink={1} justifyContent="center" alignItems="center">
            <Alert.Icon mt="1" />
            <Text fontSize="sm" color="coolGray.800" p="1">
              {children.toString()}
            </Text>
          </HStack>
          <VStack justifyContent="center" alignItems="stretch">
            <Button borderColor="black" onPress={retry} variant="outline" py={2} px={4}>
              <Text color="black">RETRY</Text>
            </Button>
          </VStack>
        </VStack>
      </Alert>
    </VStack>
  )

}