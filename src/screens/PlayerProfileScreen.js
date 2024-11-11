import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PlayerProfileScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Player Profile Screen</Text>
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

export default PlayerProfileScreen;
