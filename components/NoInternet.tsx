import { Modal } from 'native-base';
import { StyleSheet, Text, View } from "react-native";

interface Props {
  show: boolean;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
    marginBottom: 0,
    marginTop: "auto"
  },
  modalContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '600',
  },
  modalText: {
    fontSize: 18,
    color: '#555',
    marginTop: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
  },
});

export function NoInternetModal (props: Props) {
  const { show } = props;
  return (
    <Modal isOpen={show} style={styles.modal} _backdrop={{ _dark: { bg: "coolGray.800" }, bg: "warmGray.50" }}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Connection Error</Text>
        <Text style={styles.modalText}>Not connected to the Internet.</Text>
      </View>
    </Modal>
  )

}