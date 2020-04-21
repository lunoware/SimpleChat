/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 // Navigation stuff
import 'react-native-gesture-handler';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

// React
import React, { useState, useEffect } from 'react';

// Screens
import LoginScreen from './Screens/Login';
import ChatRoomsScreen from './Screens/ChatRooms';
import ChatRoomScreen from './Screens/ChatRoom';

// Firebase authentication
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-community/google-signin';

GoogleSignin.configure({
  webClientId: '952757939735-vg7uf0no9qmas2iofiak58rjoglofpv0.apps.googleusercontent.com', // From Firebase Console Settings
});

export default function App() {

  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ 
          animationTypeForReplace: user ? "push" : "pop" 
        }}
      >
        {user ? (
          <>
            <Stack.Screen
              name="Chatrooms"
              component={ChatRoomsScreen}
              options={{ title: 'Chat Rooms' }}
            />
            <Stack.Screen
              name="Chatroom"
              component={ChatRoomScreen}
              options={{ title: 'Chat Room', headerShown: true, headerTransparent: false }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}