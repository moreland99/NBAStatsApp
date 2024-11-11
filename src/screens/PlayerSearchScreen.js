import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const PlayerSearchScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>Player Search Screen</Text>
      <Button
        title="Go to Player Profile"
        onPress={() => navigation.navigate('PlayerProfile')}
      />
      <Button
        title="Go to Player Comparison"
        onPress={() => navigation.navigate('PlayerComparison')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PlayerSearchScreen;

