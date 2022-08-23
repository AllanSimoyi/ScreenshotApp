import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { extendTheme, NativeBaseProvider } from "native-base";
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';

import { Platform } from 'react-native';
import {
  focusManager, onlineManager, QueryClient,
  QueryClientProvider
} from 'react-query';
import { NoInternetModal } from './components/NoInternet';
import { useAppState } from './hooks/useAppState';
import { useOnlineManager } from './hooks/useOnlineManager';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

function onAppStateChange(status: string) {
  // React Query already supports in web browser refetch on window focus by default
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active');
  }
}

export default function App () {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  useOnlineManager();
  const isOnline = onlineManager.isOnline()
  useAppState(onAppStateChange);

  const { colors } = extendTheme({});

  const theme = extendTheme({
    colors: {
      // Add new color
      primary: colors.black,
      secondary: colors.orange,
    },
    config: {
      useSystemColorMode: false,
      // initialColorMode: 'dark',
    },
  });

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <QueryClientProvider client={queryClient}>
        <NativeBaseProvider theme={theme}>
          <SafeAreaProvider>
            <NoInternetModal show={!isOnline}/>
            <Navigation colorScheme={colorScheme} />
            <StatusBar />
          </SafeAreaProvider>
        </NativeBaseProvider>
      </QueryClientProvider>
    );
  }
}
