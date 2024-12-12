import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/components/LoginScreen';
import MainScreen from './src/components/MainScreen';
import RegisterScreen from './src/components/RegisterScreen';
import DashboardScreen from './src/components/DashboardScreen';
import AddVisitScreen from './src/components/AddVisitScreen'
import AddVisitor from './src/components/AddVisitor';
import DashboardScreenOwner from './src/components/DashboardScreenOwner';
import VisitorScreen from './src/components/VisitorHistory'
import { LogBox } from 'react-native';

// Disable all yellow box warnings
LogBox.ignoreAllLogs(true); // Ignore all warnings

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
       
         <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
         <Stack.Screen
          name="Main"
          component={MainScreen}
          options={{ headerShown: false }}
        />
         <Stack.Screen
          name="AddVisits"
          component={AddVisitScreen}
          options={{ headerShown: false }}
        />
         <Stack.Screen
          name="AddVisitor"
          component={AddVisitor}
          options={{ headerShown: false }}
        />
          <Stack.Screen
          name="VisitorScreen"
          component={VisitorScreen}
          options={{ headerShown: false }}
        />
          <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ headerShown: false }}
        />
         <Stack.Screen
          name="DashboardOwner"
          component={DashboardScreenOwner}
          options={{ headerShown: false }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
