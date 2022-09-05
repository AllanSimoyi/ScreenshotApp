import { MaterialIcons } from "@expo/vector-icons";
import { Icon, IInputProps, Input, Pressable } from "native-base";
import { useCallback, useState } from "react";

interface Props extends IInputProps { }

export function CustomPassword (props: Props) {
  const [show, setShow] = useState(false);
  const toggleShow = useCallback(() => setShow(prevState => !prevState), []);
  return (
    <Input
      {...props}
      type={show ? "text" : "password"}
      InputRightElement={<Pressable onPress={toggleShow}>
        <Icon as={<MaterialIcons name={show ? "visibility" : "visibility-off"} />} size={5} mr="2" color="muted.400" />
      </Pressable>}
    />
  )
}