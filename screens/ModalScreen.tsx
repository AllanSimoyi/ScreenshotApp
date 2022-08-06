import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { HStack, IconButton, ScrollView } from 'native-base';
import { Platform, StyleSheet } from 'react-native';

export default function ModalScreen () {
  return (
    <ScrollView style={styles.container}>
      <HStack alignItems="center" p={4}>
        <IconButton size={"lg"} variant="outline" _icon={{ as: MaterialIcons, name: "close" }} />
      </HStack>
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
});
