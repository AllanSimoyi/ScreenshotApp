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
      <VStack alignItems="center" py={8} style={{ backgroundColor: "orange" }}>
        <Text fontWeight="bold" fontSize="xl" color="#333">
          Choose how you want to report
        </Text>
      </VStack>
      <VStack justifyContent="center" alignItems="center" py={8} style={{ backgroundColor: "#000", flexGrow: 1 }}>
        <Flex flexGrow={1}></Flex>
        <VStack justifyContent="center" alignItems="stretch" py={8} width="70%">
          <Button onPress={selectAnonymous} size="lg" colorScheme="yellow" variant="outline" borderColor="yellow.500" borderWidth={1} borderRadius={35} py={4} px={6} m={4}>
            <Text color="#fff" fontWeight={"bold"} fontSize="xl">
              Anonymously
            </Text>
          </Button>
          <VStack justifyContent={"center"} alignItems="center">
            <Text fontWeight="bold" fontSize="xl" color="#fff">Or</Text>
          </VStack>
          <Button onPress={selectPublic} size="lg" colorScheme="yellow" variant="outline" borderColor="yellow.500" borderWidth={1} borderRadius={35} py={4} px={6} m={4}>
            <Text color="#fff" fontWeight={"bold"} fontSize="xl">
              Publicly
            </Text>
          </Button>
        </VStack>
        <Flex flexGrow={1}></Flex>
      </VStack>
    </VStack>

  );
}