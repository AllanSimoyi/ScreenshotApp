import { Button, Flex, Image, Text, View } from 'native-base';
import { FlatList, StyleSheet } from 'react-native';

interface Props {
  nextStage: (mode: string) => void;
}

export default function UploadOne (props: Props) {
  const { nextStage } = props;
  return (
    <Flex
      direction="column"
      justify="flex-start"
      align="stretch"
      px="0"
      style={{ height: "100%" }}
    >
      <Flex
        direction="column"
        justify="flex-start"
        align="center"
        px="0"
        py="8"
        style={{ backgroundColor: "orange" }}
      >
        <Text fontWeight="bold" fontSize="xl" color="#333">
          Choose how you want to report
        </Text>
      </Flex>
      <Flex
        direction="column"
        justify="center"
        align="center"
        px="0"
        py="8"
        style={{ backgroundColor: "#000", flexGrow: 1 }}
      >
        <Flex flexGrow={1}></Flex>
        <Flex
          direction="column"
          justify="center"
          align="stretch"
          px="0"
          py="8"
          width="70%"
        >
          <Button
            onPress={() => nextStage("Anonymously")}
            size="lg" colorScheme="yellow" variant="outline" borderColor="yellow.500" borderWidth={1} borderRadius={35} py={4} px={6} m="4">
            <Text color="#fff" fontWeight={"bold"} fontSize="xl">
              Anonymously
            </Text>
          </Button>
          <Flex
            direction="column"
            justify="center"
            align="center"
          >
            <Text fontWeight="bold" fontSize="xl" color="#fff">
              Or
            </Text>
          </Flex>
          <Button
            onPress={() => nextStage("Publicly")}
            size="lg" colorScheme="yellow" variant="outline" borderColor="yellow.500" borderWidth={1} borderRadius={35} py={4} px={6} m="4">
            <Text color="#fff" fontWeight={"bold"} fontSize="xl">
              Publicly
            </Text>
          </Button>
        </Flex>
        <Flex flexGrow={1}></Flex>
      </Flex>
    </Flex>

  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
