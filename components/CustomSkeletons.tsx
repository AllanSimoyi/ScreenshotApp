import { ISkeletonProps, Skeleton, VStack } from "native-base";

interface Props extends ISkeletonProps {
  identifier: string;
  num: number;
}

const items = ((num: number) => {
  const result: number[] = [];
  for (let i = 0; i < num; i++) {
    result.push(i);
  }
  return result;
})(4);

export function CustomSkeletons (props: Props) {
  const { num, identifier, ...restOfProps } = props;
  return (
    <VStack alignItems="stretch" p={4}>
      {items.map(num => (
        <Skeleton
          startColor="coolGray.400" key={`${ identifier }-${ num.toString() }`}
          mb="4" h="40" rounded="10" {...restOfProps}
        />
      ))}
    </VStack>
  )
}