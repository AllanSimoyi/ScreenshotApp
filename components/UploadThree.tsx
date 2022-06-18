import { Ionicons } from '@expo/vector-icons';
import { Flex, Icon, Text } from 'native-base';

export default function UploadThree () {

  return (
    <Flex
      direction="column"
      justify="flex-start"
      align="stretch"
      px="0"
      style={{ height: "100%" }}
    >
      <Flex flexGrow={1} />
      <Flex
        direction="column"
        justify="center"
        align="center"
        px="0"
        py="8"
      >
        <Text textAlign={"center"} fontWeight="extrabold" fontSize="4xl" color="#fff">
          Your Message Has Been Sent
        </Text>
        <Flex
          direction="column"
          justify="center"
          align="center"
          p="4">
          <Icon as={Ionicons} color="yellow.600" name="checkmark-circle" size="6xl" />
        </Flex>
      </Flex>
      <Flex flexGrow={1} />
    </Flex>

  );
}