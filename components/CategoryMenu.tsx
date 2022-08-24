import { MaterialIcons } from '@expo/vector-icons';
import { IconButton, Menu, Pressable } from 'native-base';
import { categoryOptions, PostCategory } from '../lib/posts';

interface Props {
  currentCategory: PostCategory
  setCurrentCategory: (newCurrentCategory: PostCategory) => void
}

interface Item {
  caption: PostCategory
  onPress: () => void
}

export function CategoryMenu (props: Props) {
  const { currentCategory, setCurrentCategory } = props;
  const items: Item[] = categoryOptions.map(option => ({
    caption: option,
    onPress: () => setCurrentCategory(option),
  }));
  return (
    <Menu w="190" defaultIsOpen={false} trigger={triggerProps => (
      <IconButton
        {...triggerProps}
        colorScheme="yellow" size="md" variant="ghost" _icon={{ as: MaterialIcons, name: "more-vert" }}
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