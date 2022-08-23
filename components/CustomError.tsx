import { Alert, Button, HStack, Text, VStack } from 'native-base';
import { InterfaceVStackProps } from 'native-base/lib/typescript/components/primitives/Stack/VStack';

interface Props extends InterfaceVStackProps {
  retry: () => void;
  children: React.ReactNode;
}

export function CustomError (props: Props) {
  const { retry, children, ...restOfProps } = props;
  return (
    <VStack justifyContent="center" alignItems="stretch" p={4} {...restOfProps}>
      <Alert w="100%" status="error">
        <VStack space={2} flexShrink={1} w="100%">
          <HStack space={2} flexShrink={1} alignItems="center">
            <Alert.Icon mt="1" />
            <Text fontSize="sm" color="coolGray.800" p="1">
              {children}
            </Text>
          </HStack>
          <VStack justifyContent="center" alignItems="center">
            <Button borderColor="black" onPress={retry} variant="outline">
              RETRY
            </Button>
          </VStack>
        </VStack>
      </Alert>
    </VStack>
  )

}