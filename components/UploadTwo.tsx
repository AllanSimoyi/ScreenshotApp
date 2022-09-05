import { Ionicons } from '@expo/vector-icons';
import {
  ImagePickerResult, launchCameraAsync,
  launchImageLibraryAsync,
  MediaTypeOptions,
  requestCameraPermissionsAsync
} from 'expo-image-picker';
import { Button, Flex, HStack, Icon, Select, Text, TextArea, VStack } from 'native-base';
import React, { useCallback, useState } from 'react';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { getImageSource } from '../lib/image-rendering';
import { categoryOptions, PostCategory, UploadMode } from '../lib/posts';
import { CreatePost, CreatePostSchema } from '../lib/validations';
import { CustomError } from './CustomError';
import { CustomImageBackground } from "./CustomImageBackground";
import { SignInComponent } from './SignInComponent';
import { UploadModeMenu } from './UploadModeMenu';
import { useCurrentUser } from './useCurrentUser';

interface Props {
  mode: UploadMode;
  setMode: (newMode: UploadMode) => void;
  sendMessage: (newPost: CreatePost) => void;
  sending: boolean;
  error: string;
  setError: (error: string) => void;
}

export default function UploadTwo (props: Props) {
  const { sendMessage, sending, mode, setMode, error, setError } = props;
  const { currentUser } = useCurrentUser();
  const [base64, setBase64] = useState('');
  const [imagePath, setImagePath] = useState('');
  const [resourceType, setResourceType] = useState('');
  const [fileName, setFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState<PostCategory>(categoryOptions[0]);
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
      console.error(message as string);
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
      console.error(message as string);
    } finally {
      setIsLoading(false);
    }
  }, [requestCameraPermissionsAsync, launchImageLibraryAsync]);

  const handleSubmit = useCallback(async () => {
    setError("");
    const details: CreatePost = {
      userId: currentUser.userId,
      uuid: uuidv4(),
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

  const handleBackFromSignIn = useCallback(() => setMode("Anonymously"), [setMode]);

  return (
    <VStack alignItems="stretch" h="100%">
      {mode === "Publicly" && !currentUser.userId && (
        <SignInComponent h={"100%"} onSuccess={undefined} back={handleBackFromSignIn} />
      )}
      {!(mode === "Publicly" && !currentUser.userId) && (
        <VStack alignItems="stretch" style={{ height: "100%" }}>
          <VStack justifyContent={"center"} alignItems="stretch" pb={2} style={{ height: 300 }}>
            <CustomImageBackground source={getImageSource(imagePath)} borderRadius={5} style={{ flex: 1, justifyContent: 'flex-end', height: 300 }}>
              <Flex direction="row" justify="center" align="flex-end">
                <VStack justifyContent={"center"} alignItems="stretch" p={2} style={{ flexGrow: 1 }}>
                  <Button
                    leftIcon={<Icon as={Ionicons} name="camera" />}
                    colorScheme="coolGray" variant="solid" onPress={takePicture}
                    isLoading={isLoading} isLoadingText="PROCESSING">
                    CAMERA
                  </Button>
                </VStack>
                <VStack justifyContent={"center"} alignItems="stretch" p={2} style={{ flexGrow: 1 }}>
                  <Button
                    leftIcon={<Icon as={Ionicons} name="images" />}
                    colorScheme="coolGray" variant="solid" onPress={selectImage}
                    isLoading={isLoading} isLoadingText="PROCESSING">
                    GALLERY
                  </Button>
                </VStack>
              </Flex>
            </CustomImageBackground>
          </VStack>
          <VStack alignItems="stretch" pb={2} px={2}>
            <VStack pb={4}>
              <HStack alignItems="flex-end" py={1}>
                <Text bold>Category</Text>
                <Flex flexGrow={1} />
                <UploadModeMenu uploadMode={mode} setUploadMode={setMode} />
              </HStack>
              <Select
                placeholder="Choose Category"
                selectedValue={category} minWidth="200" accessibilityLabel="Choose Category"
                _selectedItem={{ bg: "coolGray.400" }} onValueChange={itemValue => setCategory(itemValue as PostCategory)}
              >
                {categoryOptions.map(category => <Select.Item label={category} value={category} />)}
              </Select>
            </VStack>
            <VStack space={2}>
              <Text bold>
                Description (optional)
              </Text>
              <TextArea
                placeholder="Provide a description (optional)"
                isDisabled={isLoading} w="100%"
                autoCompleteType borderRadius={5} value={description} onChangeText={setDescription}
              />
            </VStack>
            {Boolean(error) && (<CustomError retry={handleSubmit}>{error}</CustomError>)}
            <VStack alignItems="stretch" py={6}>
              <Button onPress={handleSubmit} variant="solid" colorScheme="coolGray">
                {sending && "SENDING..."}
                {!sending && "SEND"}
              </Button>
            </VStack>
          </VStack>
        </VStack>
      )}
    </VStack>
  );
}
