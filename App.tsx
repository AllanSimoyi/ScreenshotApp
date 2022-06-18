import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import { NativeBaseProvider, extendTheme } from "native-base";

import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
  onlineManager,
  focusManager,
} from 'react-query'
import { NoInternetModal } from './components/no-internet';
import { useOnlineManager } from './hooks/useOnlineManager';
import { useAppState } from './hooks/useAppState';
import { Platform } from 'react-native';

const queryClient = new QueryClient({
  // defaultOptions: { queries: { retry: 2 } },
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
