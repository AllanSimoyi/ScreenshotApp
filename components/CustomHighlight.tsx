import { Text } from 'native-base';
import Highlighter from 'react-native-highlight-words';

interface Props {
  searchString: string;
  children: string;
}

export function CustomHighlight (props: Props) {
  const { searchString, children } = props;

  return (
    <>
      {!searchString && (
        <Text>{children}</Text>
      )}
      {searchString && (
        <Highlighter
          highlightStyle={{ backgroundColor: 'orange' }}
          searchWords={[searchString]}
          textToHighlight={children}
        />
      )}
    </>
  );
}
