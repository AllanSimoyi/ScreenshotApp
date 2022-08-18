import { ISkeletonProps, Skeleton, VStack } from "native-base";

interface Props extends ISkeletonProps {
  num: number;
}

export function CustomSkeletons (props: Props) {
  const { num, ...restOfProps } = props;
  return (
    <VStack alignItems="stretch" p={4}>
      {createNumberedArray(num).map(_ => (
        <Skeleton mb="4" h="40" rounded="10" {...restOfProps} />
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