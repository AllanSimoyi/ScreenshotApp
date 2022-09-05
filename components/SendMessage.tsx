import { MaterialIcons } from "@expo/vector-icons";
import { HStack, IconButton, Input, VStack } from "native-base";

interface Props {
  message: string;
  setMessage: (newContent: string) => void;
  sendMessage: () => void;
}

export function SendMessage (props: Props) {
  const { message, setMessage, sendMessage } = props;
  return (
    <HStack alignItems="stretch" borderRadius={10}>
      <VStack justifyContent="center" alignItems="center" pl={2} flexGrow={1}>
        <Input
          width="100%" my={2} px={4} colorScheme="red"
          value={message} onChangeText={setMessage}
          fontWeight="bold" variant="rounded" placeholder="Type Something..."
        />
      </VStack>
      <VStack justifyContent="center" alignItems="center" p={2}>
        <IconButton colorScheme="coolGray" onPress={sendMessage} _icon={{ as: MaterialIcons, name: "send" }} />
      </VStack>
    </HStack>
  )
}