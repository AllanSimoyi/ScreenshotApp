import { MaterialIcons } from '@expo/vector-icons';
import { IconButton, Menu, Pressable, Text } from 'native-base';
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
      <Pressable {...triggerProps}>
        <Text italic fontSize="md" mt="2" color="white">{uploadMode}</Text>
      </Pressable>
    )}>
      {items.map(item => (
        <Menu.Item key={item.caption} onPress={item.onPress}>
          {item.caption}
        </Menu.Item>
      ))}
    </Menu>
  )
}