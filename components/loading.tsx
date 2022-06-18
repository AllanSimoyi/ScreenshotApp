import { Flex, Text } from 'native-base';
import React from 'react';

interface Props {
  children?: React.ReactNode;
}

export function Loading (props: Props) {
  const { children } = props;
  return (
    <Flex
      flexDirection="column"
      justify="center"
      align="center"
      p="4"
    >
      <Text fontSize="lg" color="#fff">
        {children || "Loading..."}
      </Text>
    </Flex>
  )
}