import { Text, VStack } from 'native-base';
import React from 'react';

interface Props {
  children?: React.ReactNode;
}

export function Loading (props: Props) {
  const { children } = props;
  return (
    <VStack justifyContent="center" alignItems="center" p={4}>
      <Text fontSize="lg" color="#fff">
        {children || "Loading..."}
      </Text>
    </VStack>
  )
}