import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import PlayerSearchScreen from './src/screens/PlayerSearchScreen';
import PlayerProfileScreen from './src/screens/PlayerProfileScreen';
import PlayerComparisonScreen from './src/screens/PlayerComparisonScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator initialRouteName="PlayerSearch">
        <Stack.Screen
          name="PlayerSearch"
          component={PlayerSearchScreen}
          options={{ title: 'Player Search' }}
        />
        <Stack.Screen
          name="PlayerProfile"
          component={PlayerProfileScreen}
          options={{ title: 'Player Profile' }}
        />
        <Stack.Screen
          name="PlayerComparison"
          component={PlayerComparisonScreen}
          options={{ title: 'Player Comparison' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

