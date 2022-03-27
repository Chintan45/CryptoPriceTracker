import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AddNewAssetScreen from '../Screens/AddNewAssetScreen';
import CoinDetailsScreen from '../Screens/CoinDetails';
import BottomTabNavigator from './BottomTabNavigator';

const Stack = createNativeStackNavigator();

const Navigation = () => {
  return (
    <Stack.Navigator
      initialRouteName="Root"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Root" component={BottomTabNavigator} />
      <Stack.Screen name="CoinDetailedScreen" component={CoinDetailsScreen} />
      <Stack.Screen
        name="AddNewAssetScreen"
        component={AddNewAssetScreen}
        options={{
          headerShown: true,
          title: 'Add New Asset',
          headerStyle: {
            backgroundColor: '#121212',
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </Stack.Navigator>
  );
};

export default Navigation;
