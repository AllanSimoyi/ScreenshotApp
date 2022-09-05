import { StatusBar } from 'expo-status-bar';
import { extendTheme, NativeBaseProvider } from "native-base";
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  focusManager, QueryClient,
  QueryClientProvider
} from 'react-query';
import { CurrentUserProvider } from './components/CurrentUserProvider';
import { Sync } from './components/Sync';
import { useAppState } from './hooks/useAppState';
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import { db } from './lib/db';
import Navigation from './navigation';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

function onAppStateChange (status: string) {
  // React Query already supports in web browser refetch on window focus by default
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active');
  }
}

function createPostsTableSQL () {
  const fields = [
    "id integer primary key not null",
    "userId int",
    "uuid text",
    "resourceUrl text",
    "publicId text",
    "width int",
    "height int",
    "resourceType text",
    "publicly int",
    "category text",
    "description text",
    "createdAt text",
    "updatedAt text",
  ];
  return `create table if not exists posts (${ fields.join(", ") });`
}

export default function App () {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  useAppState(onAppStateChange);
  const { colors } = extendTheme({});
  const theme = extendTheme({
    colors: {
      primary: colors.white,
      secondary: colors.coolGray,
    },
    config: {
      useSystemColorMode: true,
    },
  });
  useEffect(() => {
    try {
      db.transaction((tx) => {
        // tx.executeSql(`drop table posts;`, []);
        tx.executeSql(createPostsTableSQL());
      });
      console.log("Database created.");
    } catch ({ message }) {
      console.error(message as string || "Something went wrong.");
    } 
  }, []);
  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <QueryClientProvider client={queryClient}>
        <NativeBaseProvider theme={theme}>
          <SafeAreaProvider>
            <CurrentUserProvider>
              <Sync isLoadingComplete={isLoadingComplete}>
                <Navigation colorScheme={colorScheme} />
              </Sync>
              <StatusBar />
            </CurrentUserProvider>
          </SafeAreaProvider>
        </NativeBaseProvider>
      </QueryClientProvider>
    );
  }
}
