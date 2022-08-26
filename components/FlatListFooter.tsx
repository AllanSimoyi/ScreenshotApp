import { Spinner, Text, VStack } from "native-base";

interface Props {
  listName: string
  isLoadingMore: boolean
  atEndOfList: boolean
  isEmptyList: boolean
}

export function FlatListFooter (props: Props) {
  const {listName, isLoadingMore, atEndOfList, isEmptyList} = props;
  return (
    <VStack alignItems="center" p={4}>
      {isLoadingMore && <Spinner size="lg" color="yellow.600" />}
      {atEndOfList && !isEmptyList && <Text fontSize="sm" color="white" p="1">End Of {listName}</Text>}
    </VStack>
  )
}