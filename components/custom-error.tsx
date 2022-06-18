import { Alert, Button, Flex, HStack, Text, VStack } from 'native-base';

interface Props {
  retry: () => void;
  children: React.ReactNode;
}

export function CustomError (props: Props) {

  const { retry, children } = props;

  return (
    <Flex
      direction="column"
      justify="center"
      align="stretch"
      p="4"
    >
      <Alert
        w="100%"
        status="error"
      >
        <VStack
          space={2}
          flexShrink={1}
          w="100%"
        >
          <HStack
            flexShrink={1}
            space={2}
            justifyContent="space-between"
          >
            <HStack
              space={2}
              flexShrink={1}
            >
              <Alert.Icon mt="1" />
              <Text
                fontSize="sm"
                color="coolGray.800"
                p="1"
              >
                {children}
              </Text>
            </HStack>
          </HStack>
          <Flex
            direction="column"
            justify="center"
            align="center"
          >
            <Button
              borderColor="black"
              onPress={retry}
              variant="outline"
            >
              RETRY
            </Button>
          </Flex>
        </VStack>
      </Alert>
    </Flex>
  )

}