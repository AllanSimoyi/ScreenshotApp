import { Button, Menu } from 'native-base';
import { UploadMode, uploadModes } from '../lib/posts';

interface Props {
  isUploading: boolean;
  uploadMode: UploadMode
  setUploadMode: (newUploadMode: UploadMode) => void
}

interface Item {
  caption: UploadMode
  onPress: () => void
}

export function UploadModeMenu (props: Props) {
  const { isUploading, uploadMode, setUploadMode } = props;
  const items: Item[] = uploadModes.map(mode => ({
    caption: mode,
    onPress: () => setUploadMode(mode),
  }));
  return (
    <Menu w="190" defaultIsOpen={false} trigger={triggerProps => (
      <Button {...triggerProps} isDisabled={isUploading} colorScheme="coolGray" variant="solid">
        {uploadMode.toUpperCase()}
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