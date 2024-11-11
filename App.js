import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import PlayerSearchScreen from './src/screens/PlayerSearchScreen';
import PlayerProfileScreen from './src/screens/PlayerProfileScreen';
import PlayerComparisonScreen from './src/screens/PlayerComparisonScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="PlayerSearch"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === 'PlayerSearch') {
              iconName = 'search';
            } else if (route.name === 'PlayerProfile') {
              iconName = 'person';
            } else if (route.name === 'PlayerComparison') {
              iconName = 'stats-chart';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'blue',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="PlayerSearch" component={PlayerSearchScreen} options={{ title: 'Search' }} />
        <Tab.Screen name="PlayerProfile" component={PlayerProfileScreen} options={{ title: 'Profile' }} />
        <Tab.Screen name="PlayerComparison" component={PlayerComparisonScreen} options={{ title: 'Comparison' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

