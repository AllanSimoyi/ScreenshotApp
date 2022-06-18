import { Ionicons } from '@expo/vector-icons';
import {
  launchCameraAsync,
  launchImageLibraryAsync,
  MediaTypeOptions,
  requestCameraPermissionsAsync
} from 'expo-image-picker';
import { Alert, Button, Flex, HStack, Icon, ScrollView, Select, Text, TextArea, VStack } from 'native-base';
import React, { useCallback, useState } from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
import { CreatePost, CreatePostSchema } from '../lib/validations';

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

  const takePicture = useCallback(async () => {
    try {
      const { status } = await requestCameraPermissionsAsync();

      if (status !== 'granted') {
        return setError('No access to camera');
      }

      setIsLoading(true);

      const result = await launchCameraAsync({
        base64: true,
        quality: 1,
      });

      if (!result.cancelled) {
        setBase64(result.base64 || '');
        setImagePath(result.uri);
        setResourceType(result.type || "");
        setFileName((new Date).getTime().toString())
      } else {
        // cancelled
      }
    } catch ({ message }) {
      console.log(message as string);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const selectImage = useCallback(async () => {
    try {
      const { status } = await requestCameraPermissionsAsync();

      if (status !== 'granted') {
        return setError('No access to camera');
      }

      setIsLoading(true);

      const result = await launchImageLibraryAsync({
        mediaTypes: MediaTypeOptions.All,
        allowsEditing: true,
        quality: 1,
        base64: true,
      });

      if (!result.cancelled) {
        setBase64(result.base64 || '');
        setImagePath(result.uri);
        setResourceType(result.type || "");
        setFileName((new Date).getTime().toString())
      } else {
        // cancelled
      }
    } catch ({ message }) {
      console.log(message as string);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // const cloudinaryUpload = (photo: any) => {
  //   return new Promise<string>((resolve, reject) => {
  //     const UPLOAD_RESET = 'pbpinhve';

  //     const CLOUD_NAME = "dv2mivpiz";
  //     const url = `https://api.cloudinary.com/v1_1/${ CLOUD_NAME }/upload`;

  //     const formData = new FormData();
  //     formData.append('file', photo);
  //     formData.append('upload_preset', UPLOAD_RESET);
  //     formData.append('tags', 'rte');
  //     formData.append('context', '');
  //     formData.append("cloud_name", CLOUD_NAME)

  //     axios.post(url, formData, {
  //       headers: {
  //         "Content-type": "multipart/form-data",
  //         "Access-Control-Allow-Origin": "*",
  //       }
  //     })
  //       .then(data => {
  //         return resolve((data as any).secure_url);
  //       }).catch(err => {
  //         console.log("???" + err);
  //         return reject(err?.message || "Image upload failed");
  //       });
  //   })

  // }

  async function submitFn () {

    // let uploadedImageUrl = "";

    // try {
    //   uploadedImageUrl = await uploadImageToServer(imagePath);
    //   console.log(uploadedImageUrl + " uploaded");
    // } catch (error) {
    //   console.log("---" + error);
    //   return setError((error as any).toString());
    // }
    setError("")

    const details: CreatePost = {
      resourceBase64: 'data:image/jpeg;base64,' + base64,
      resourceType: "Image",
      publicly: mode !== "Anonymously",
      category,
      description,
    }

    const result = await CreatePostSchema.safeParseAsync(details);

    if (!result.success) {
      return setError(result.error.issues.map(issue => issue.path[0].toString() + " " + issue.message.toLowerCase()).join(", "));
    }

    sendMessage(result.data);

  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Flex
        direction="column"
        justify="flex-start"
        align="stretch"
        px="0"
        style={{ height: "100%" }}
      >
        <Flex
          direction="column"
          justify="center"
          align="stretch"
          pb="2"
          px="0"
          style={{ height: 300 }}
        >
          <ImageBackground
            source={
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              imagePath
                ? { uri: imagePath }
                : require('../assets/images/image_placeholder.jpeg')
            }
            accessible
            accessibilityLabel="Issue"
            resizeMode="cover"
            // blurRadius={1}
            borderRadius={5}
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              height: 300,
            }}
          >
            <Flex direction="row" justify="center" align="flex-end">
              <Flex
                direction="column"
                justify="center"
                align="stretch"
                p="2"
                style={{ flexGrow: 1 }}
              >
                <Button
                  size="xs"
                  leftIcon={<Icon as={Ionicons} color="#333" name="camera" size="xs" />}
                  colorScheme="yellow"
                  variant="solid"
                  bgColor="yellow.600"
                  borderColor="yellow.600"
                  borderWidth={1}
                  borderRadius={35}
                  isLoading={isLoading}
                  isLoadingText="PROCESSING"
                  onPress={takePicture}>
                  <Text color="#333" fontWeight={"bold"} fontSize="xs">
                    CAMERA
                  </Text>
                </Button>
              </Flex>
              <Flex
                direction="column"
                justify="center"
                align="stretch"
                p="2"
                style={{ flexGrow: 1 }}
              >
                <Button
                  size="xs"
                  colorScheme="yellow"
                  variant="solid"
                  bgColor="yellow.600"
                  borderColor="yellow.600"
                  borderWidth={1}
                  borderRadius={35}
                  leftIcon={<Icon as={Ionicons} color="#333" name="images" size="xs" />}
                  isLoading={isLoading}
                  isLoadingText="PROCESSING"
                  onPress={selectImage}>
                  <Text color="#333" fontWeight={"bold"} fontSize="xs">
                    GALLERY
                  </Text>
                </Button>
              </Flex>
              {/* <Flex
                direction="column"
                justify="center"
                align="stretch"
                p="2"
                style={{ flexGrow: 1 }}
              >
                <Button
                  disabled
                  size="xs"
                  leftIcon={<Icon as={Ionicons} color="#333" name="videocam" size="xs" />}
                  colorScheme="yellow"
                  variant="solid"
                  bgColor="gray.400"
                  // bgColor="yellow.600"
                  // borderColor="yellow.600"
                  borderWidth={1}
                  borderRadius={35}
                  isLoading={isLoading}
                  isLoadingText="PROCESSING"
                  onPress={takePicture}>
                  <Text color="#333" fontWeight={"bold"} fontSize="xs">
                    VIDEO
                  </Text>
                </Button>
              </Flex> */}
            </Flex>
          </ImageBackground>
        </Flex>
        <Flex
          direction="column"
          justify="flex-start"
          align="stretch"
          py="2"
          px="2"
        >
          <Flex
            direction="row"
            justify="flex-start"
            align="center">
            <Text bold fontSize="md" mt="2" color="#fff">
              Category
            </Text>
            <Flex flexGrow={1} />
            <Text italic fontSize="md" mt="2" color="#d1d1d1">
              {mode}
            </Text>
          </Flex>
          <Select
            borderRadius={15}
            color="white"
            fontSize={"md"}
            selectedValue={category}
            minWidth="200"
            accessibilityLabel="Choose Category"
            _selectedItem={{
              bg: "gray.400",
              // borderRadius: 15,
            }} mt={1} onValueChange={itemValue => setCategory(itemValue)}
            placeholder="Choose Category"
          >
            {categories.map(category => <Select.Item label={category} value={category} />)}
          </Select>
          <Text bold fontSize="md" mb="2" mt="4" color="#fff">
            Description (optional)
          </Text>
          <TextArea
            placeholder="Provide a description (optional)"
            autoCompleteType
            borderRadius={15}
            value={description}
            onChangeText={setDescription}
            // onChange={(e) => {
            //   setDescription((e.currentTarget as any).value as string)
            // }}
            isDisabled={isLoading}
            w="100%"
            color="white"
            fontSize={"md"}
          />
          {
            error &&
            <Flex
              direction="column"
              justify="center"
              align="stretch"
              py="4"
            >
              <Alert w="100%" status="error">
                <VStack space={2} flexShrink={1} w="100%">
                  <HStack flexShrink={1} space={2} justifyContent="space-between">
                    <HStack space={2} flexShrink={1}>
                      <Alert.Icon mt="1" />
                      <Text fontSize="md" color="coolGray.800">
                        {error}
                      </Text>
                    </HStack>
                    <Flex
                      direction="column"
                      justify="center"
                      align="center">
                      <Button borderColor="black" onPress={submitFn} variant="outline">
                        RETRY
                      </Button>
                    </Flex>
                  </HStack>
                </VStack>
              </Alert>
            </Flex>
          }
          <Button
            size="md"
            // colorScheme="yellow"
            variant="solid"
            bgColor="yellow.600"
            borderWidth={1}
            borderRadius={35}
            py={2}
            px={4}
            mt="6"
            mb="4"
            onPress={submitFn}
          >
            <Text color="#333" fontWeight={"bold"} fontSize="xl">
              {sending && "SENDING..."}
              {!sending && "SEND"}
            </Text>
          </Button>
        </Flex>
      </Flex>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    // backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  cameraContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: 'teal',
  },
  camera: {
    width: '100%',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {},
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
