// src/screens/PlayerProfileScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { fetchPlayerStats } from '../services/nbaApiService';

const PlayerProfileScreen = ({ route }) => {
  const { playerId, playerName } = route.params;
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPlayerData = async () => {
      const playerStats = await fetchPlayerStats(playerId);
      setStats(playerStats);

      setLoading(false);
    };

    loadPlayerData();
  }, [playerId]);

  if (loading) {
    return <ActivityIndicator style={styles.loading} size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{playerName}</Text>

      <Text style={styles.sectionHeader}>Current Season Statistics</Text>
      {stats ? (
        <View style={styles.statsContainer}>
          <Text style={styles.stats}>Points per Game: {stats.points || 'N/A'}</Text>
          <Text style={styles.stats}>Assists per Game: {stats.assists || 'N/A'}</Text>
          <Text style={styles.stats}>Rebounds per Game: {stats.rebounds || 'N/A'}</Text>
          <Text style={styles.stats}>Field Goal %: {stats.fieldGoalPercentage ? `${stats.fieldGoalPercentage}%` : 'N/A'}</Text>
          <Text style={styles.stats}>3-Point %: {stats.threePointPercentage ? `${stats.threePointPercentage}%` : 'N/A'}</Text>
          <Text style={styles.stats}>Free Throw %: {stats.freeThrowPercentage ? `${stats.freeThrowPercentage}%` : 'N/A'}</Text>
          <Text style={styles.stats}>Turnovers per Game: {stats.turnovers || 'N/A'}</Text>
          <Text style={styles.stats}>Player Efficiency Rating: {stats.per || 'N/A'}</Text>
        </View>
      ) : (
        <Text style={styles.noStats}>Statistics not available.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  statsContainer: {
    alignItems: 'center',
  },
  stats: {
    fontSize: 16,
    marginBottom: 5,
  },
  noStats: {
    fontSize: 16,
    color: 'gray',
    marginTop: 10,
  },
});

export default PlayerProfileScreen;
