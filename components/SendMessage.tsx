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
    <HStack alignItems="stretch" style={{ borderRadius: 10, backgroundColor: "rgba(255, 255, 255, 0.1)" }}>
      <VStack justifyContent="center" alignItems="center" pl={2} py={2} style={{ flexGrow: 1 }}>
        <Input
          value={message} onChangeText={setMessage}
          fontWeight="bold" variant="outline" placeholder="Type Something..."
          color="yellow.600" borderColor="yellow.600" borderWidth="1"
          size="xl" width="100%" my={2} py={2} px={4}
        />
      </VStack>
      <VStack justifyContent="center" alignItems="center" p={2}>
        <IconButton colorScheme="yellow" size="md" onPress={sendMessage} _icon={{ as: MaterialIcons, name: "send" }} />
      </VStack>
    </HStack>
  )
}