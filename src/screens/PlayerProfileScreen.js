import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { fetchPlayerStats } from '../services/nbaApiService';

const PlayerProfileScreen = ({ route }) => {
  const { playerId, playerName } = route.params;
  const [playerStats, setPlayerStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPlayerStats = async () => {
      setLoading(true);
      const stats = await fetchPlayerStats(playerId);
      setPlayerStats(stats);
      setLoading(false);
    };

    getPlayerStats();
  }, [playerId]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{playerName}'s Career Stats</Text>

      {loading ? (
        <Text style={styles.loading}>Loading stats...</Text>
      ) : playerStats && playerStats.length > 0 ? (
        <View style={styles.statsContainer}>
          {playerStats.map((stat, index) => (
            <View key={index} style={styles.statItem}>
              <Text style={styles.statTitle}>{stat.statType}</Text>
              <Text>Points: {stat.pointsPerGame || 'N/A'}</Text>
              <Text>Assists: {stat.assistsPerGame || 'N/A'}</Text>
              <Text>Rebounds: {stat.totalReboundsPerGame || 'N/A'}</Text>
              <Text>Steals: {stat.stealsPerGame || 'N/A'}</Text>
              {/* Add more stats as needed */}
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.noStats}>No career stats available.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  loading: {
    fontSize: 16,
    color: 'gray',
  },
  statsContainer: {
    marginTop: 10,
  },
  statItem: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  statTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  noStats: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default PlayerProfileScreen;
