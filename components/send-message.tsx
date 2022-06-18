import { MaterialIcons } from "@expo/vector-icons";
import { Flex, IconButton, Input } from "native-base";

interface Props {
  message: string;
  setMessage: (newContent: string) => void;
  sendMessage: () => void;
}

export function SendMessage (props: Props) {
  const { message, setMessage, sendMessage } = props;
  return (
    <Flex
      flexDirection="row"
      justify="flex-start"
      align="stretch"
      style={{
        borderRadius: 10,
        backgroundColor: "rgba(255, 255, 255, 0.24)"
      }}
    >
      <Flex
        flexDirection="column"
        justify="center"
        align="center"
        p="2"
        style={{ flexGrow: 1 }}
      >
        <Input
          value={message}
          onChangeText={(text) => setMessage(text)}
          size="xl"
          fontWeight="bold"
          color="yellow.600"
          width="100%"
          placeholder="Type Something..."
          variant="rounded"
          borderColor="yellow.600"
          borderWidth="1"
          my="2"
          py="2"
          px="4"
        />
      </Flex>
      <Flex
        flexDirection="column"
        justify="center"
        align="center"
        p="2"
      >
        <IconButton
          colorScheme="yellow"
          size="md"
          // borderWidth={2}
          // borderRadius="full"
          // variant="outline"
          onPress={sendMessage}
          _icon={{
            as: MaterialIcons,
            name: "send"
          }} />
      </Flex>
    </Flex>
  )
}