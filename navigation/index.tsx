/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Icon, Input, Text, VStack } from 'native-base';
import * as React from 'react';
import { ColorSchemeName, StatusBar } from 'react-native';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import DiscoverScreen from '../screens/DiscoverScreen';
import FeedScreen from '../screens/FeedScreen';
import InboxScreen from '../screens/InboxScreen';
import ModalScreen from '../screens/ModalScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import ProfileScreen from '../screens/ProfileScreen';
import UploadScreen from '../screens/UploadScreen';
import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types';
import LinkingConfiguration from './LinkingConfiguration';


export default function Navigation ({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <StatusBar
        animated={true}
        barStyle={'dark-content'}
      />
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator () {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="Modal" component={ModalScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator () {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="Feed"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        headerStyle: {
          backgroundColor: 'orange',
        }
      }}>
      <BottomTab.Screen
        name="Feed"
        component={FeedScreen}
        options={({ navigation }: RootTabScreenProps<'Feed'>) => ({
          headerTitle: (props) => <Text fontSize="2xl" fontWeight="bold" color="#333">Feeds</Text>,
          tabBarIcon: ({ color }) => <TabBarIcon name="feed" color={color} />,
        })}
      />
      <BottomTab.Screen
        name="Discover"
        component={DiscoverScreen}
        options={({ }: RootTabScreenProps<'Discover'>) => ({
          headerStyle: { backgroundColor: "orange" },
          headerTitle: (_) => (
            <VStack alignItems="stretch" minWidth="full">
              <Text fontSize="2xl" fontWeight="bold" color="#333">Discover</Text>
            </VStack>
          ),
          tabBarIcon: ({ color }) => <TabBarIcon name="search" color={color} />,
        })}
      />
      <BottomTab.Screen
        name="Upload"
        component={UploadScreen}
        options={({ }: RootTabScreenProps<'Upload'>) => ({
          headerTitle: (_) => (
            <VStack justifyContent="center" alignItems="center" minWidth="full">
              <Text fontSize="2xl" fontWeight="bold" color="#333">Speak Up & Help</Text>
            </VStack>
          ),
          tabBarIcon: ({ color }) => <TabBarIcon name="plus-square" color={color} />,
        })}
      />
      <BottomTab.Screen
        name="Inbox"
        component={InboxScreen}
        options={({ }: RootTabScreenProps<'Inbox'>) => ({
          headerStyle: { backgroundColor: "orange", height: 150 },
          headerTitle: (_) => (
            <VStack alignItems="stretch" py={2}>
              <Text fontSize="2xl" fontWeight="bold" color="#333">Inbox</Text>
              <Input
                size="xl" mt="2" py="1" px="4"
                fontWeight="bold" color="black" width="80%"
                borderWidth="2" variant="rounded" borderColor="#333" placeholder="Search"
                InputRightElement={<Icon mx="2" size="6" color="#333" as={<Ionicons name="ios-search" />} />}
              />
            </VStack>
          ),
          tabBarIcon: ({ color }) => <TabBarIcon name="envelope" color={color} />,
        })}
      />
      <BottomTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={({ }: RootTabScreenProps<'Profile'>) => ({
          headerTitle: (_) => <Text fontSize="2xl" fontWeight="bold" color="#333">Profile</Text>,
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        })}
      />
    </BottomTab.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon (props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}
