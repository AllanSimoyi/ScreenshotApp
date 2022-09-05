import { Button, Flex, Text, VStack } from 'native-base';
import { useCallback } from 'react';
import { UploadMode } from '../lib/posts';

interface Props {
  nextStage: (mode: UploadMode) => void;
}

export default function UploadOne (props: Props) {
  const { nextStage } = props;
  const selectPublic = useCallback(() => nextStage("Publicly"), [nextStage]);
  const selectAnonymous = useCallback(() => nextStage("Anonymously"), [nextStage]);
  return (
    <VStack alignItems="stretch" style={{ height: "100%" }}>
      <VStack justifyContent="center" alignItems="center" py={8} flexGrow={1}>
        <Flex flexGrow={1}></Flex>
        <Text fontWeight="bold" fontSize="xl">
          Choose how you want to report
        </Text>
        <VStack justifyContent="center" alignItems="stretch" py={8} width="70%" space={4}>
          <Button onPress={selectAnonymous} colorScheme="coolGray" variant="solid" p={4}>
            Anonymously
          </Button>
          <VStack justifyContent={"center"} alignItems="center">
            <Text fontWeight="bold" fontSize="xl">Or</Text>
          </VStack>
          <Button onPress={selectPublic} colorScheme="coolGray" variant="solid" p={4}>
            Publicly
          </Button>
        </VStack>
        <Flex flexGrow={1}></Flex>
      </VStack>
    </VStack>

  );
}