import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Image, TouchableOpacity } from 'react-native';
import { fetchPlayerStats, fetchPlayerLastFiveGames, fetchPlayerOverview, fetchTeamRoster, fetchPlayerSeasonStats } from '../services/nbaApiService';
import { BarChart } from 'react-native-svg-charts';
import { G, Rect, Text as SVGText, Line } from 'react-native-svg';
import playerData from '../../player_data.json';
import * as scale from 'd3-scale';

const screenWidth = Dimensions.get('window').width;

// Team colors mapping
const teamColors = {
  "Atlanta Hawks": "#E03A3E",
  "Boston Celtics": "#007A33",
  "Brooklyn Nets": "#000000",
  "Charlotte Hornets": "#1D1160",
  "Chicago Bulls": "#CE1141",
  "Cleveland Cavaliers": "#860038",
  "Dallas Mavericks": "#00538C",
  "Denver Nuggets": "#0E2240",
  "Detroit Pistons": "#C8102E",
  "Golden State Warriors": "#1D428A",
  "Houston Rockets": "#CE1141",
  "Indiana Pacers": "#002D62",
  "Los Angeles Clippers": "#C8102E",
  "Los Angeles Lakers": "#552583",
  "Memphis Grizzlies": "#5D76A9",
  "Miami Heat": "#98002E",
  "Milwaukee Bucks": "#00471B",
  "Minnesota Timberwolves": "#0C2340",
  "New Orleans Pelicans": "#0C2340",
  "New York Knicks": "#006BB6",
  "Oklahoma City Thunder": "#007AC1",
  "Orlando Magic": "#0077C0",
  "Philadelphia 76ers": "#006BB6",
  "Phoenix Suns": "#1D1160",
  "Portland Trail Blazers": "#E03A3E",
  "Sacramento Kings": "#5A2D81",
  "San Antonio Spurs": "#C4CED4",
  "Toronto Raptors": "#CE1141",
  "Utah Jazz": "#002B5C",
  "Washington Wizards": "#002B5C"
};

// Mapping of team names to their abbreviations
const teamNameToIdMap = {
  "Atlanta Hawks": "ATL",
  "Boston Celtics": "BOS",
  "Brooklyn Nets": "BRK",
  "Charlotte Hornets": "CHO",
  "Chicago Bulls": "CHI",
  "Cleveland Cavaliers": "CLE",
  "Dallas Mavericks": "DAL",
  "Denver Nuggets": "DEN",
  "Detroit Pistons": "DET",
  "Golden State Warriors": "GSW",
  "Houston Rockets": "HOU",
  "Indiana Pacers": "IND",
  "Los Angeles Clippers": "LAC",
  "Los Angeles Lakers": "LAL",
  "Memphis Grizzlies": "MEM",
  "Miami Heat": "MIA",
  "Milwaukee Bucks": "MIL",
  "Minnesota Timberwolves": "MIN",
  "New Orleans Pelicans": "NOP",
  "New York Knicks": "NYK",
  "Oklahoma City Thunder": "OKC",
  "Orlando Magic": "ORL",
  "Philadelphia 76ers": "PHI",
  "Phoenix Suns": "PHO",
  "Portland Trail Blazers": "POR",
  "Sacramento Kings": "SAC",
  "San Antonio Spurs": "SAS",
  "Toronto Raptors": "TOR",
  "Utah Jazz": "UTA",
  "Washington Wizards": "WAS"
};

const getTeamId = (teamName) => teamNameToIdMap[teamName] || null;

// Custom Bar Component for Conditional Coloring
const CustomBar = ({ x, y, value, index, average }) => {
  const barColor = value >= average ? 'green' : 'red';
  return (
    <G key={`bar-${index}`}>
      <Rect
        x={x(index)}
        y={y(value)}
        width={x.bandwidth()}
        height={y(0) - y(value)}
        fill={barColor}
      />
    </G>
  );
};

// Custom Decorator Component for displaying values on top of bars
const Decorator = ({ x, y, data }) => {
  return data.map((value, index) => (
    <SVGText
      key={index}
      x={x(index) + x.bandwidth() / 2}
      y={y(value) - 10}
      fontSize={12}
      fill="black"
      alignmentBaseline="middle"
      textAnchor="middle"
    >
      {value}
    </SVGText>
  ));
};

const PlayerProfileScreen = ({ route }) => {
  const { playerId, playerName } = route.params;
  const [playerOverview, setPlayerOverview] = useState(null);
  const [playerStats, setPlayerStats] = useState([]);
  const [recentGames, setRecentGames] = useState([]);
  const [seasonStats, setSeasonStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStat, setSelectedStat] = useState('points');
  const [imageError, setImageError] = useState(false);
  const [jerseyNumber, setJerseyNumber] = useState('N/A');
  const [headerColor, setHeaderColor] = useState('FFFFFF');
  const [activeTab, setActiveTab] = useState('Overview');

  const playerInfo = playerData.find(player => player.name === playerName);
  const imageUrl = playerInfo ? playerInfo.image_url : 'https://via.placeholder.com/200?text=No+Image';

  useEffect(() => {
    const getPlayerData = async () => {
      setLoading(true);

      const seasonStatsData = await fetchPlayerSeasonStats(playerId);
      setSeasonStats(seasonStatsData);
  
      const seasonStats = await fetchPlayerStats(playerId);
      setPlayerStats(seasonStats.body || []);
  
      const lastFiveGames = await fetchPlayerLastFiveGames(playerId, '2025');
      setRecentGames(lastFiveGames);
  
      try {
        const overviewData = await fetchPlayerOverview(playerId);
        setPlayerOverview(overviewData);
  
        if (overviewData && overviewData.teams && overviewData.teams.length > 0) {
          const latestTeamInfo = overviewData.teams[overviewData.teams.length - 1];
          const [teamName, seasonYear] = latestTeamInfo.split(', ');

          const color = teamColors[teamName] || "#FFFFFF";
          setHeaderColor(color);
  
          const teamId = getTeamId(teamName);
          const endYear = parseInt(seasonYear.trim(), 10);
          const startYear = endYear - 1;
          const seasonId = `${startYear}-${endYear}`;
  
          if (teamId && seasonId) {
            const jersey = await fetchTeamRoster(teamId, seasonId, playerId);
            setJerseyNumber(jersey);
          }
        }
      } catch (error) {
        console.error('Error fetching player overview:', error);
      }
  
      setLoading(false);
    };
  
    getPlayerData();
  }, [playerId]);

  const calculateExperience = (draftInfo) => {
    const currentYear = new Date().getFullYear();
    const draftYearMatch = draftInfo.match(/(\d{4}) NBA Draft/);
    if (draftYearMatch) {
      const draftYear = parseInt(draftYearMatch[1], 10);
      return currentYear - draftYear;
    }
    return 'N/A';
  };

  const getLatestTeam = (teams) => {
    if (!teams || teams.length === 0) return 'No Team Available';
  
    const sortedTeams = teams.sort((a, b) => {
      const endYearA = parseInt(a.split(', ')[1].split('-')[1], 10) || 0;
      const endYearB = parseInt(b.split(', ')[1].split('-')[1], 10) || 0;
      return endYearB - endYearA;
    });

    return sortedTeams[0].split(', ')[0];
  };

  const latestTeam = playerOverview ? getLatestTeam(playerOverview.teams) : 'No Team Available';
  const experienceYears = playerOverview ? calculateExperience(playerOverview.draftInfo) : 'N/A';

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
  const chartData = recentGames.map((game) => {
    if (selectedStat === 'points') return parseFloat(game.points) || 0;
    if (selectedStat === 'assists') return parseFloat(game.assists) || 0;
    if (selectedStat === 'rebounds') return parseFloat(game.totalRebounds) || 0;
    return 0;
  });
  
  const selectedAverage =
    selectedStat === 'points'
      ? seasonAverages?.pointsPerGame
      : selectedStat === 'assists'
      ? seasonAverages?.assistsPerGame
      : seasonAverages?.reboundsPerGame;

  const maxChartValue = Math.max(...chartData, selectedAverage); // Ensure the scale considers both max data and average
  const chartHeight = 200;

  const yScale = scale
    .scaleLinear()
    .domain([0, maxChartValue]) // Define the range from 0 to maxChartValue
    .range([chartHeight, 0]); // SVG coordinates for 200 height (bottom to top)

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={[styles.header, { backgroundColor: headerColor }]}>
        <Image
          source={{ uri: imageError ? 'https://via.placeholder.com/200?text=No+Image' : imageUrl }}
          style={styles.playerImage}
          resizeMode="contain"
          onError={() => setImageError(true)}
        />
        <Text style={styles.playerName}>{playerName}</Text>
        <Text style={styles.teamName}>{latestTeam}</Text>
      </View>

      <View style={styles.tabContainer}>
        {["Overview", "Stats", "Games", "Splits", "Bio"].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)} // Update the active tab on press
            style={[
              styles.tabButton,
              activeTab === tab && styles.activeTabButton // Apply active style if this tab is selected
            ]}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Conditional Rendering of Tab Content */}
      {activeTab === "Overview" && (
        <>
          <View style={styles.section}>
            {/* Overview Content */}
            <Text style={styles.sectionTitle}>Overview</Text>
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>Position: {playerOverview?.positions || 'N/A'}</Text>
              <Text style={styles.infoText}>Number: #{jerseyNumber}</Text>
              <Text style={styles.infoText}>Height: {playerOverview?.height || 'N/A'}</Text>
              <Text style={styles.infoText}>Weight: {playerOverview?.weight || 'N/A'}</Text>
              <Text style={styles.infoText}>Experience: {experienceYears} years</Text>
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

            {chartData.length > 0 && (
              <BarChart
                style={{ height: 200, width: screenWidth - 40 }}
                data={chartData}
                yAccessor={({ item }) => item}
                contentInset={{ top: 20, bottom: 20 }}
                spacingInner={0.2}
                gridMin={0}
                svg={{ fill: 'transparent' }}
              >
                {chartData.map((value, index) => (
                  <CustomBar
                    key={index}
                    x={(i) => i * (screenWidth - 40) / chartData.length}
                    y={(v) => 200 - (v / maxChartValue) * 200}
                    value={value}
                    index={index}
                    average={selectedAverage}
                  />
                ))}
                {/* Dotted Line for Average */}
                <Line
                  x1="0"
                  x2={screenWidth - 40}
                  y1={yScale(selectedAverage)}  // Correct position based on yScale
                  y2={yScale(selectedAverage)}  // Correct position based on yScale
                  stroke="black"
                  strokeDasharray={[4, 4]} // Dotted pattern
                  strokeWidth="2"
                  opacity={0.2} // Reduced opacity
                />
                <Decorator x={(i) => i * (screenWidth - 40) / chartData.length} y={(v) => 200 - (v / Math.max(...chartData)) * 200} data={chartData} />
              </BarChart>
            )}
          </View>
        </>
      )}

      {activeTab === "Stats" && (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Season Stats</Text>
    {playerStats.length > 0 ? (
      playerStats.map((season, index) => (
        <View key={index} style={styles.seasonStatsContainer}>
          <Text style={styles.seasonText}>Season: {season.season}</Text>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Points Per Game:</Text>
            <Text style={styles.statValue}>{(season.totalPoints / season.gamesPlayed).toFixed(1) || 'N/A'}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Assists Per Game:</Text>
            <Text style={styles.statValue}>{(season.totalAssists / season.gamesPlayed).toFixed(1) || 'N/A'}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Rebounds Per Game:</Text>
            <Text style={styles.statValue}>{(season.totalRebounds / season.gamesPlayed).toFixed(1) || 'N/A'}</Text>
          </View>
        </View>
      ))
    ) : (
      <Text>No Stats Available</Text>
    )}
  </View>
)}


    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  playerImage: {
    width: 150,
    height: 150,
    borderRadius: 50,
    marginBottom: -10,
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
    // Additional styles for the "Stats" tab
    seasonStatsContainer: {
      backgroundColor: '#F9F9F9',
      padding: 10,
      borderRadius: 8,
      marginBottom: 10,
      borderColor: '#E0E0E0',
      borderWidth: 1,
    },
    seasonText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 8,
    },
    statRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 4,
    },
    statLabel: {
      fontSize: 16,
      color: '#666',
    },
    statValue: {
      fontSize: 16,
      fontWeight: '600',
      color: '#333',
    },
});

export default PlayerProfileScreen;
