import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PlayerComparisonScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Player Comparison Screen</Text>
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

export default PlayerComparisonScreen;

