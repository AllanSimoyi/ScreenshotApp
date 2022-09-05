import { MaterialIcons } from '@expo/vector-icons';
import { IconButton, Menu, Pressable } from 'native-base';
import { categoryOptions, PostCategory } from '../lib/posts';

interface Props {
  items: Item[]
}

interface Item {
  caption: string
  onPress: () => void
}

export function ProfileMenu (props: Props) {
  const { items } = props;
  return (
    <Menu w="190" defaultIsOpen={false} trigger={triggerProps => (
      <IconButton
        {...triggerProps}
        size="md"
        colorScheme="coolGray"
        variant="ghost"
        _icon={{ as: MaterialIcons, name: "more-vert" }}
      />
    )}>
      {items.map(item => (
        <Menu.Item key={item.caption} onPress={item.onPress}>
          {item.caption}
        </Menu.Item>
      ))}
    </Menu>
  )
}