import React, {useEffect} from 'react';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import { navigationRef } from './utils/Navigationservice';

import AntDesign from '@react-native-vector-icons/ant-design';

import {createStackNavigator} from '@react-navigation/stack';
import Player from './screens/Player';
import BootSplash from 'react-native-bootsplash';


import Login from './screens/Login';

import {PersistGate} from 'redux-persist/integration/react';
import {Provider, useDispatch, useSelector} from 'react-redux';



const Stack = createStackNavigator();
const BottomTab = createBottomTabNavigator();

import {persistor, store} from './store/store';


import { BottomNavigation } from './components/Navigation/Navigation';

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="login" component={Login} />
    </Stack.Navigator>
  );
}

function AuthenticatedStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="tabs"
        component={BottomNavigation}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Player"
        component={Player}
        options={({navigation}) => ({
          presentation: 'modal',
          headerShown: false,
          headerLeft: () => (
            <AntDesign
              name="down"
              size={24}
              style={{marginHorizontal: 8}}
              onPress={() => navigation.goBack()}
            />
          ),
          headerRight: () => (
            <AntDesign
              name="ellipsis"
              size={24}
              style={{marginHorizontal: 8}}
            />
          ),
        })}
      />
    

    </Stack.Navigator>
  );
}

function AppWithBootstrap() {
  const loggedIn = useSelector(state => state.auth.isAuthenticate);

  return (
    <>
      <NavigationContainer onReady={() => BootSplash.hide()}>
        {loggedIn ? <AuthenticatedStack /> : <AuthStack />}
      </NavigationContainer>
    </>
  );
}

export default function App() {
    
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppWithBootstrap />
      </PersistGate>
    </Provider>
  );
}
