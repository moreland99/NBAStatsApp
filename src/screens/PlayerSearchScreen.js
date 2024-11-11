// src/screens/PlayerSearchScreen.js

import React, { useState } from 'react';
import { View, TextInput, Button, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { searchPlayers } from '../services/nbaApiService';

const PlayerSearchScreen = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [players, setPlayers] = useState([]);

  const handleSearch = async () => {
    if (query.trim() === '') return;

    try {
      const playersData = await searchPlayers(query); // Already returns the body from nbaApiService
      console.log('Formatted players data:', playersData); // Log data to verify correct format

      // Set players data if the response is correctly formatted as an array
      if (Array.isArray(playersData)) {
        setPlayers(playersData);
      } else {
        console.warn('Unexpected API response structure:', playersData);
        setPlayers([]); // Clear list if format is unexpected
      }
    } catch (error) {
      console.error('Error fetching players:', error);
      setPlayers([]); // Clear list if there is an error
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search for players"
        value={query}
        onChangeText={setQuery}
        style={styles.input}
      />
      <Button title="Search" onPress={handleSearch} />

      {players.length === 0 ? (
        <Text style={styles.noResults}>No players found.</Text>
      ) : (
        <FlatList
          data={players}
          keyExtractor={(item) => item.playerId.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate('PlayerProfile', {
                playerId: item.playerId,
                playerName: `${item.firstName} ${item.lastName}`
              })}
            >
              <Text style={styles.playerName}>{item.firstName} {item.lastName}</Text>
            </TouchableOpacity>
          )}
          style={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    borderBottomWidth: 1,
    padding: 8,
    marginBottom: 16,
  },
  playerName: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingVertical: 5,
  },
  noResults: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginTop: 20,
  },
  list: {
    borderWidth: 1,
    borderColor: 'black',
    marginTop: 10,
  },
});

export default PlayerSearchScreen;
