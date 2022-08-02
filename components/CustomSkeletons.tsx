import { Skeleton, VStack } from "native-base";

interface Props {
  num: number;
}

export function CustomSkeletons (props: Props) {
  const { num } = props;
  return (
    <VStack alignItems="stretch" p={4}>
      {createNumberedArray(num).map(_ => (
        <Skeleton mb="4" h="40" rounded="10" />
      ))}
    </VStack>
  )
}

function createNumberedArray (num: number) {
  const result: number[] = [];
  for (let i = 0; i < num; i++) {
    result.push(num);
  }
  return result;
}