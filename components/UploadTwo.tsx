import { Ionicons } from '@expo/vector-icons';
import {
  ImagePickerResult, launchCameraAsync,
  launchImageLibraryAsync,
  MediaTypeOptions,
  requestCameraPermissionsAsync
} from 'expo-image-picker';
import { Button, Flex, HStack, Icon, ScrollView, Select, Text, TextArea, VStack } from 'native-base';
import React, { useCallback, useState } from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
import { getImageSource } from '../lib/image-rendering';
import { CreatePost, CreatePostSchema } from '../lib/validations';
import { CustomError } from './custom-error';

interface Props {
  mode: string;
  sendMessage: (newPost: CreatePost) => void;
  sending: boolean;
  error: string;
  setError: (error: string) => void;
}

const categories = [
  "Abuse of State Resources",
  "Public Finance Management",
  "Natural Resource Governance",
];

export default function UploadTwo (props: Props) {
  const { sendMessage, sending, mode, error, setError } = props;

  const [base64, setBase64] = useState('');
  const [imagePath, setImagePath] = useState('');
  const [resourceType, setResourceType] = useState('');
  const [fileName, setFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState(categories[0]);
  const [description, setDescription] = useState("");

  const requestCamera = useCallback(async () => {
    const { status } = await requestCameraPermissionsAsync();
    if (status !== 'granted') {
      return setError('No access to camera');
    }
  }, [requestCameraPermissionsAsync]);

  const processCameraResult = useCallback((result: ImagePickerResult) => {
    if (!result.cancelled) {
      setBase64(result.base64 || '');
      setImagePath(result.uri);
      setResourceType(result.type || "");
      setFileName((new Date).getTime().toString())
    }
  }, []);

  const takePicture = useCallback(async () => {
    try {
      setIsLoading(true);
      await requestCamera();
      const result = await launchCameraAsync({ base64: true, quality: 1 });
      processCameraResult(result);
    } catch ({ message }) {
      console.log(message as string);
    } finally {
      setIsLoading(false);
    }
  }, [requestCameraPermissionsAsync, launchCameraAsync]);

  const selectImage = useCallback(async () => {
    try {
      setIsLoading(true);
      await requestCamera();
      const result = await launchImageLibraryAsync({
        mediaTypes: MediaTypeOptions.All,
        allowsEditing: true,
        quality: 1,
        base64: true,
      });
      processCameraResult(result);
    } catch ({ message }) {
      console.log(message as string);
    } finally {
      setIsLoading(false);
    }
  }, [requestCameraPermissionsAsync, launchImageLibraryAsync]);

  const handleSubmit = useCallback(async () => {
    setError("");
    const details: CreatePost = {
      resourceBase64: 'data:image/jpeg;base64,' + base64,
      resourceType: "Image",
      publicly: mode !== "Anonymously",
      category,
      description,
    }
    const result = await CreatePostSchema.safeParseAsync(details);
    if (!result.success) {
      const errorMessage = result.error.issues
        .map(issue => `${ issue.path[0].toString() } ${ issue.message.toLowerCase() }`)
        .join(", ");
      return setError(errorMessage);
    }
    sendMessage(result.data);
  }, [CreatePostSchema, category, description, base64, mode]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <VStack alignItems="stretch" style={{ height: "100%" }}>
        <VStack justifyContent={"center"} alignItems="stretch" pb={2} style={{ height: 300 }}>
          <ImageBackground
            source={getImageSource(imagePath)}
            accessible accessibilityLabel="Issue" resizeMode="cover"
            borderRadius={5} style={{ flex: 1, justifyContent: 'flex-end', height: 300 }}
          >
            <Flex direction="row" justify="center" align="flex-end">
              <VStack justifyContent={"center"} alignItems="stretch" p={2} style={{ flexGrow: 1 }}>
                <Button
                  size="xs" leftIcon={<Icon as={Ionicons} color="#333" name="camera" size="xs" />}
                  colorScheme="yellow" variant="solid" bgColor="yellow.600" onPress={takePicture}
                  borderColor="yellow.600" borderWidth={1} borderRadius={35} isLoading={isLoading} isLoadingText="PROCESSING">
                  <Text color="#333" fontWeight={"bold"} fontSize="xs">CAMERA</Text>
                </Button>
              </VStack>
              <VStack justifyContent={"center"} alignItems="stretch" p={2} style={{ flexGrow: 1 }}>
                <Button
                  leftIcon={<Icon as={Ionicons} />} onPress={selectImage} name="images"
                  size="xs" colorScheme="yellow" color="#333" isLoading={isLoading} isLoadingText="PROCESSING"
                  variant="solid" bgColor="yellow.600" borderColor="yellow.600" borderWidth={1} borderRadius={35}>
                  <Text color="#333" fontWeight={"bold"} fontSize="xs">GALLERY</Text>
                </Button>
              </VStack>
            </Flex>
          </ImageBackground>
        </VStack>
        <VStack alignItems="stretch" p={2}>
          <HStack alignItems="center">
            <Text bold fontSize="md" mt="2" color="#fff">Category</Text>
            <Flex flexGrow={1} />
            <Text italic fontSize="md" mt="2" color="#d1d1d1">{mode}</Text>
          </HStack>
          <Select
            borderRadius={15} color="white" placeholder="Choose Category"
            fontSize={"md"} selectedValue={category} minWidth="200" accessibilityLabel="Choose Category"
            _selectedItem={{ bg: "gray.400" }} mt={1} onValueChange={itemValue => setCategory(itemValue)}
          >
            {categories.map(category => <Select.Item label={category} value={category} />)}
          </Select>
          <Text bold fontSize="md" mb="2" mt="4" color="#fff">
            Description (optional)
          </Text>
          <TextArea
            placeholder="Provide a description (optional)"
            autoCompleteType borderRadius={15} value={description} onChangeText={setDescription}
            isDisabled={isLoading} w="100%" fontSize={"md"} color="white"
          />
          {error && (<CustomError retry={handleSubmit}>RETRY</CustomError>)}
          <Button onPress={handleSubmit} size="md" variant="solid" bgColor="yellow.600" borderWidth={1} borderRadius={35} py={2} px={4} mt={6} mb={4}>
            <Text color="#333" fontWeight={"bold"} fontSize="xl">
              {sending && "SENDING..."}
              {!sending && "SEND"}
            </Text>
          </Button>
        </VStack>
      </VStack>
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
