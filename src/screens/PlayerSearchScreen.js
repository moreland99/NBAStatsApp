// src/screens/PlayerSearchScreen.js

import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { searchPlayers } from '../services/nbaApiService';
import { Ionicons } from '@expo/vector-icons'; // Icon package

const PlayerSearchScreen = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);

  useEffect(() => {
    if (query.trim() === '') {
      setPlayers([]); // Clear the list when the query is empty
      return;
    }

    // Clear previous timeout
    if (typingTimeout) clearTimeout(typingTimeout);

    // Set a timeout to delay the API call
    const timeoutId = setTimeout(() => handleSearch(query), 500); // 500ms delay
    setTypingTimeout(timeoutId);
  }, [query]);

  const handleSearch = async (searchQuery) => {
    setLoading(true);
    try {
      const playersData = await searchPlayers(searchQuery);

      if (Array.isArray(playersData)) {
        setPlayers(playersData);
      } else {
        console.warn('Unexpected API response structure:', playersData);
        setPlayers([]);
      }
    } catch (error) {
      console.error('Error fetching players:', error);
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="gray" style={styles.icon} />
        <TextInput
          placeholder="Search for players"
          value={query}
          onChangeText={setQuery}
          style={styles.input}
          placeholderTextColor="#888"
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#1E90FF" style={styles.loadingIndicator} />
      ) : players.length === 0 && query.trim() !== '' ? (
        <Text style={styles.noResults}>No players found.</Text>
      ) : (
        <FlatList
          data={players}
          keyExtractor={(item) => item.playerId.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('PlayerProfile', {
                  playerId: item.playerId,
                  playerName: `${item.firstName} ${item.lastName}`,
                })
              }
              style={styles.playerItem}
            >
              <Text style={styles.playerName}>{item.firstName} {item.lastName}</Text>
              <Ionicons name="arrow-forward" size={16} color="gray" />
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
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 5,
    fontSize: 16,
    color: '#333',
  },
  playerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  playerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  noResults: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginTop: 20,
  },
  loadingIndicator: {
    marginTop: 20,
  },
  list: {
    marginTop: 10,
  },
});

export default PlayerSearchScreen;
