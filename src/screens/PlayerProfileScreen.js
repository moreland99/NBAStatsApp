import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Image, TouchableOpacity } from 'react-native';
import { fetchPlayerStats, fetchPlayerLastFiveGames, fetchPlayerOverview } from '../services/nbaApiService';
import { BarChart } from 'react-native-chart-kit';
import playerData from '../../player_data.json';

const screenWidth = Dimensions.get('window').width;

const PlayerProfileScreen = ({ route }) => {
  const { playerId, playerName } = route.params;
  const [playerOverview, setPlayerOverview] = useState(null);
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

       // Fetch player overview from the API
       try {
        const response = await fetch(`https://basketball-head.p.rapidapi.com/players/${playerId}`, {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': BASKETBALL_HEAD_API_KEY,
            'X-RapidAPI-Host': BASKETBALL_HEAD_API_HOST,
          },
        });
        const data = await response.json();
        setPlayerOverview(data.body); // Set the player overview data
      } catch (error) {
        console.error('Error fetching player overview:', error);
      }

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
      {/* Header Section */}
      <View style={styles.header}>
        <Image
          source={{ uri: imageError ? 'https://via.placeholder.com/200?text=No+Image' : imageUrl }}
          style={styles.playerImage}
          resizeMode="contain"
          onError={() => setImageError(true)}
        />
        <Text style={styles.playerName}>{playerName}</Text>
        <Text style={styles.teamName}>Team Name</Text>
      </View>

      {/* Tab Section */}
      <View style={styles.tabContainer}>
        {["Overview", "Stats", "Games", "Splits", "Bio"].map((tab) => (
          <TouchableOpacity key={tab} style={styles.tabButton}>
            <Text style={styles.tabText}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

       {/* Overview Section */}
       <View style={styles.section}>
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>Position: {playerOverview?.positions || 'N/A'}</Text>
          <Text style={styles.infoText}>Number: #{playerOverview?.number || 'N/A'}</Text>
          <Text style={styles.infoText}>Height: {playerOverview?.height || 'N/A'}</Text>
          <Text style={styles.infoText}>Weight: {playerOverview?.weight || 'N/A'}</Text>
          <Text style={styles.infoText}>Experience: {playerOverview?.experience || 'N/A'} years</Text>
        </View>
      </View>

      {/* Season Stats Section */}
      {currentSeasonStats && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2024-25 Regular Season</Text>
          <View style={styles.statsBox}>
            <Text style={styles.stat}>PPG: {seasonAverages?.pointsPerGame || 'N/A'}</Text>
            <Text style={styles.stat}>RPG: {seasonAverages?.reboundsPerGame || 'N/A'}</Text>
            <Text style={styles.stat}>APG: {seasonAverages?.assistsPerGame || 'N/A'}</Text>
          </View>
        </View>
      )}

      {/* Last 5 Games Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Last 5 Games</Text>
        <View style={styles.toggleContainer}>
          <TouchableOpacity onPress={() => setSelectedStat('points')} style={styles.toggleButton(selectedStat === 'points')}>
            <Text style={styles.toggleButtonText}>Points</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelectedStat('assists')} style={styles.toggleButton(selectedStat === 'assists')}>
            <Text style={styles.toggleButtonText}>Assists</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelectedStat('rebounds')} style={styles.toggleButton(selectedStat === 'rebounds')}>
            <Text style={styles.toggleButtonText}>Rebounds</Text>
          </TouchableOpacity>
        </View>
        <BarChart
          data={chartData}
          width={screenWidth - 40}
          height={220}
          fromZero
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4B2A6A',
    padding: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  playerImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  playerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  teamName: {
    fontSize: 16,
    color: '#ddd',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#333',
    paddingVertical: 10,
  },
  tabButton: {
    paddingHorizontal: 10,
  },
  tabText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  section: {
    padding: 15,
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoBox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infoText: {
    width: '48%',
    fontSize: 16,
    marginBottom: 5,
  },
  statsBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  stat: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  toggleButton: (active) => ({
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 15,
    backgroundColor: active ? '#4B2A6A' : '#ddd',
  }),
  toggleButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  chart: {
    borderRadius: 16,
  },
});

export default PlayerProfileScreen;

