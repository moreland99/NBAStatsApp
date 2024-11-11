import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const PlayerSearchScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Player Search Screen</Text>
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

