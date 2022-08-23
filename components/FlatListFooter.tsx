import { Spinner, Text, VStack } from "native-base";

interface Props {
  listName: string
  isLoadingMore: boolean
  atEndOfList: boolean
}

export function FlatListFooter (props: Props) {
  const {listName, isLoadingMore, atEndOfList} = props;
  return (
    <VStack alignItems="stretch" p={4}>
      {isLoadingMore && <Spinner size="lg" />}
      {atEndOfList && <Text fontSize="sm" color="coolGray.800" p="1">End Of {listName}</Text>}
    </VStack>
  )
}