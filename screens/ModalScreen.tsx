import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { Flex, IconButton, ScrollView } from 'native-base';
import { Platform, StyleSheet } from 'react-native';

import { Text, View } from '../components/Themed';

export default function ModalScreen () {
  return (
    <ScrollView style={styles.container}>
      <Flex
        flexDirection="row"
        justifyContent="flex-start"
        alignItems="center"
        p="4">
        <IconButton size={"lg"} variant="outline" _icon={{
          as: MaterialIcons,
          name: "close"
        }} />
      </Flex>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </ScrollView>
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
