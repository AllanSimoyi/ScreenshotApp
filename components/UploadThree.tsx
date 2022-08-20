import { Ionicons } from '@expo/vector-icons';
import { Flex, Icon, Text, VStack } from 'native-base';

export default function UploadThree () {
  return (
    <VStack alignItems="stretch" style={{ height: "100%" }}>
      <Flex flexGrow={1} />
      <VStack justifyContent={"center"} alignItems="center" py={8}>
        <Text textAlign={"center"} fontWeight="extrabold" fontSize="4xl" color="#fff">
          Your Message Has Been Sent
        </Text>
        <VStack justifyContent="center" alignItems="center" p={4}>
          <Icon as={Ionicons} color="yellow.600" name="checkmark-circle" size="6xl" />
        </VStack>
      </VStack>
      <Flex flexGrow={1} />
    </VStack>
  );
}