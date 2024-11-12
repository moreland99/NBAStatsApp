import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Button, Image } from 'react-native';
import { fetchPlayerStats, fetchPlayerLastFiveGames } from '../services/nbaApiService';
import { BarChart } from 'react-native-chart-kit';
import playerData from '../../player_data.json';

const screenWidth = Dimensions.get('window').width;

const PlayerProfileScreen = ({ route }) => {
  const { playerId, playerName } = route.params;
  const [playerStats, setPlayerStats] = useState([]);
  const [recentGames, setRecentGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStat, setSelectedStat] = useState('points');
  const [imageError, setImageError] = useState(false);

  // Look up player info directly in player_data.json
  const playerInfo = playerData.find(player => player.name === playerName);
  const imageUrl = playerInfo ? playerInfo.image_url : 'https://via.placeholder.com/200?text=No+Image';

  useEffect(() => {
    const getPlayerData = async () => {
      setLoading(true);

      const seasonStats = await fetchPlayerStats(playerId);
      setPlayerStats(seasonStats.body || []);

      const lastFiveGames = await fetchPlayerLastFiveGames(playerId, '2025');
      setRecentGames(lastFiveGames);

      setLoading(false);
    };

    getPlayerData();
  }, [playerId]);

  const calculateAverages = (seasonStats) => {
    if (seasonStats && seasonStats.gamesPlayed > 0) {
      return {
        pointsPerGame: (seasonStats.totalPoints / seasonStats.gamesPlayed).toFixed(1),
        assistsPerGame: (seasonStats.totalAssists / seasonStats.gamesPlayed).toFixed(1),
        reboundsPerGame: (seasonStats.totalRebounds / seasonStats.gamesPlayed).toFixed(1),
      };
    }
    return null;
  };

  const currentSeasonStats = Array.isArray(playerStats)
    ? playerStats.find((stat) => stat.season === "2024-2025" && stat.statType === "Totals")
    : null;

  const seasonAverages = currentSeasonStats ? calculateAverages(currentSeasonStats) : null;

  const chartData = {
    labels: recentGames.map((game, index) => `G${index + 1}`),
    datasets: [
      {
        data: recentGames.map((game) => {
          if (selectedStat === 'points') return parseFloat(game.points) || 0;
          if (selectedStat === 'assists') return parseFloat(game.assists) || 0;
          if (selectedStat === 'rebounds') return parseFloat(game.totalRebounds) || 0;
          return 0;
        }),
      },
    ],
  };

  return (
    <ScrollView style={styles.container}>
      {/* Player Image Display */}
      <Image
  source={{
    uri: imageError ? 'https://via.placeholder.com/200?text=No+Image' : imageUrl,
  }}
  style={styles.playerImage}
  resizeMode="contain" // Adjust to "contain" to fit the entire image without cropping
  onError={() => {
    console.log(`Failed to load image for ${playerName} with ID: ${playerId}`);
    setImageError(true);
  }}
/>

      
      <Text style={styles.header}>{playerName}'s 2024-25 Season Stats</Text>

      {loading ? (
        <Text style={styles.loading}>Loading stats...</Text>
      ) : currentSeasonStats ? (
        <>
          <Text style={styles.chartTitle}>Game-by-Game Performance</Text>

          <View style={styles.toggleContainer}>
            <Button title="Points" onPress={() => setSelectedStat('points')} color={selectedStat === 'points' ? 'red' : 'gray'} />
            <Button title="Assists" onPress={() => setSelectedStat('assists')} color={selectedStat === 'assists' ? 'blue' : 'gray'} />
            <Button title="Rebounds" onPress={() => setSelectedStat('rebounds')} color={selectedStat === 'rebounds' ? 'green' : 'gray'} />
          </View>

          <View style={{ position: 'relative' }}>
            <BarChart
              key={`${selectedStat}-${Math.random()}`}
              data={{
                labels: chartData.labels,
                datasets: chartData.datasets,
              }}
              width={screenWidth - 20}
              height={220}
              fromZero={true}
              showValuesOnTopOfBars
              chartConfig={{
                backgroundColor: '#333',
                backgroundGradientFrom: '#555',
                backgroundGradientTo: '#777',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: { borderRadius: 16 },
              }}
              style={styles.chart}
            />
          </View>

          <View style={styles.statsContainer}>
            <Text style={styles.sectionHeader}>Season Averages</Text>
            <Text>Points per Game: {seasonAverages?.pointsPerGame || 'N/A'}</Text>
            <Text>Assists per Game: {seasonAverages?.assistsPerGame || 'N/A'}</Text>
            <Text>Rebounds per Game: {seasonAverages?.reboundsPerGame || 'N/A'}</Text>
          </View>

          <View style={styles.statsContainer}>
            <Text style={styles.sectionHeader}>Season Totals</Text>
            <Text>Total Points: {currentSeasonStats.totalPoints || 'N/A'}</Text>
            <Text>Total Assists: {currentSeasonStats.totalAssists || 'N/A'}</Text>
            <Text>Total Rebounds: {currentSeasonStats.totalRebounds || 'N/A'}</Text>
            <Text>Games Played: {currentSeasonStats.gamesPlayed || 'N/A'}</Text>
          </View>
        </>
      ) : (
        <Text>No stats available for the current season.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  playerImage: {
    width: screenWidth - 20,
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 20,
  },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  loading: { fontSize: 16, color: 'gray', textAlign: 'center' },
  chartTitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 10, textAlign: 'center' },
  chart: { marginVertical: 8, borderRadius: 16 },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  statsContainer: { marginBottom: 20, padding: 10, borderWidth: 1, borderColor: '#ddd', borderRadius: 5, backgroundColor: '#f9f9f9' },
  sectionHeader: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
});

export default PlayerProfileScreen;
