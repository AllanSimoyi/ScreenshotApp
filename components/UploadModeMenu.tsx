import { MaterialIcons } from '@expo/vector-icons';
import { Button, IconButton, Menu, Pressable, Text } from 'native-base';
import { categoryOptions, UploadMode, uploadModes } from '../lib/posts';

interface Props {
  uploadMode: UploadMode
  setUploadMode: (newUploadMode: UploadMode) => void
}

interface Item {
  caption: UploadMode
  onPress: () => void
}

export function UploadModeMenu (props: Props) {
  const { uploadMode, setUploadMode } = props;
  const items: Item[] = uploadModes.map(mode => ({
    caption: mode,
    onPress: () => setUploadMode(mode),
  }));
  return (
    <Menu w="190" defaultIsOpen={false} trigger={triggerProps => (
      <Button {...triggerProps}
        size="xs" colorScheme="yellow" variant="solid" bgColor="yellow.600"
        borderColor="yellow.600" borderWidth={1} borderRadius={5}>
        <Text color="#333" fontWeight={"bold"} fontSize="xs">{uploadMode.toUpperCase()}</Text>
      </Button>
    )}>
      {items.map(item => (
        <Menu.Item key={item.caption} onPress={item.onPress}>
          {item.caption}
        </Menu.Item>
      ))}
    </Menu>
  )
}