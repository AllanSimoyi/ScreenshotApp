import { AVPlaybackStatus, ResizeMode, Video, VideoReadyForDisplayEvent } from 'expo-av';
import { Pressable, Text, VStack } from 'native-base';
import * as React from 'react';
import { StyleSheet } from 'react-native';

interface PlaybackStatus {
  isPlaying: boolean;
}

interface Props {
  publicId: string;
  uri: string;
}

export function CustomVideo ({ publicId, uri }: Props) {
  const video = React.useRef<Video | null>(null);
  const [status, setStatus] = React.useState<PlaybackStatus>({ isPlaying: false });
  const [customState, setCustomState] = React.useState<string>("");
  const handleStatusUpdate = React.useCallback((status: any) => {
    setStatus(status);
  }, []);
  return (
    <VStack alignItems="stretch">
      <Video
        ref={video}
        style={styles.video}
        source={{ uri: uri }}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        isLooping
        onPlaybackStatusUpdate={handleStatusUpdate}
        onLoadStart={() => {
          setCustomState("Loading...");
        }}
        onLoad={(status: AVPlaybackStatus) => {
          setCustomState("Loaded");
        }}
        onError={(error: string) => {
          setCustomState("Something went wrong, please try again");
          console.log("Error", error)
        }}
        onReadyForDisplay={(event: VideoReadyForDisplayEvent) => {
          setCustomState("Tap To Play");
        }}
      />
      <VStack justifyContent="center" alignItems="center" p={2}>
        <Pressable onPress={() => status.isPlaying ? video.current?.pauseAsync() : video.current?.playAsync()}>
          <Text fontSize="xs">{customState}</Text>
        </Pressable>
      </VStack>
    </VStack>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
  video: {
    alignSelf: 'center',
    width: "100%",
    height: 400,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});