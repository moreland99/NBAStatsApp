import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { fetchPlayerStats } from '../services/nbaApiService';

const PlayerProfileScreen = ({ route }) => {
  const { playerId, playerName } = route.params;
  const [playerStats, setPlayerStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPlayerStats = async () => {
      setLoading(true);
      const stats = await fetchPlayerStats(playerId);
      setPlayerStats(stats.body || []); // Ensure we access `body` where data resides
      setLoading(false);
    };

    getPlayerStats();
  }, [playerId]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>{playerName}'s Career Stats</Text>

      {loading ? (
        <Text style={styles.loading}>Loading stats...</Text>
      ) : playerStats.length > 0 ? (
        playerStats.map((stat, index) => (
          <View key={index} style={styles.statItem}>
            <Text style={styles.statTitle}>{stat.season} - {stat.team}</Text>
            <Text>Position: {stat.position || 'N/A'}</Text>
            <Text>Games Played: {stat.gamesPlayed}</Text>
            <Text>Minutes Played: {stat.minutesPlayed}</Text>
            <Text>Total Points: {stat.totalPoints}</Text>
            <Text>Total Rebounds: {stat.totalRebounds}</Text>
            <Text>Total Assists: {stat.totalAssists}</Text>
            <Text>Field Goal %: {stat.fieldGoalPercentage}</Text>
            <Text>Three Point %: {stat.threePointFieldGoalPercentage}</Text>
            <Text>Free Throw %: {stat.freeThrowPercentage}</Text>
            {/* Add other stats as needed */}
          </View>
        ))
      ) : (
        <Text style={styles.noStats}>No career stats available.</Text>
      )}
    </ScrollView>
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
    textAlign: 'center',
  },
  loading: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
  },
  statItem: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
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
