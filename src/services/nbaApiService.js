//nbaApiService.js

import Constants from 'expo-constants';

const BASKETBALL_HEAD_API_KEY = Constants.expoConfig.extra.BASKETBALL_HEAD_API_KEY;
const BASKETBALL_HEAD_API_HOST = Constants.expoConfig.extra.BASKETBALL_HEAD_API_HOST;

const BASKETBALL_HEAD_API_BASE_URL = 'https://basketball-head.p.rapidapi.com';

// Function to search players by name
export const searchPlayers = async (playerName) => {
  try {
    const url = `${BASKETBALL_HEAD_API_BASE_URL}/players/searchv2`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': BASKETBALL_HEAD_API_KEY,
        'X-RapidAPI-Host': BASKETBALL_HEAD_API_HOST
      },
      body: JSON.stringify({ query: playerName })
    });

    if (!response.ok) throw new Error(`Failed to fetch players, status: ${response.status}`);

    const data = await response.json();
    return data.body || [];
  } catch (error) {
    console.error('Error searching players:', error);
    return [];
  }
};

// Function to fetch player metadata (overview) - New Function
export const fetchPlayerOverview = async (playerId) => {
  try {
    const response = await fetch(`${BASKETBALL_HEAD_API_BASE_URL}/players/${playerId}`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': BASKETBALL_HEAD_API_KEY,
        'X-RapidAPI-Host': BASKETBALL_HEAD_API_HOST,
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching player overview, status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Fetched Player Overview:', JSON.stringify(data, null, 2)); // Log to verify
    return data.body || null; // Assuming data.body contains the player metadata
  } catch (error) {
    console.error('Error fetching player overview:', error);
    return null;
  }
};

// Function to fetch player statistics for the current season
export const fetchPlayerStats = async (playerId) => {
  try {
    const response = await fetch(`${BASKETBALL_HEAD_API_BASE_URL}/players/${playerId}/stats/Totals?seasonType=Regular`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': BASKETBALL_HEAD_API_KEY,
        'X-RapidAPI-Host': BASKETBALL_HEAD_API_HOST,
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching stats, status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Fetched Player Stats:', JSON.stringify(data, null, 2)); // Log the entire response data

    return data;
  } catch (error) {
    console.error('Error fetching player stats:', error);
    return null;
  }
};

export const fetchPlayerLastFiveGames = async (playerId, season = '2024') => {
  try {
    const response = await fetch(`${BASKETBALL_HEAD_API_BASE_URL}/players/${playerId}/games/${season}`, {
      method: 'POST',
      headers: {
        'X-RapidAPI-Key': BASKETBALL_HEAD_API_KEY,
        'X-RapidAPI-Host': BASKETBALL_HEAD_API_HOST,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pageSize: 100 }),
    });

    if (!response.ok) {
      throw new Error(`Error fetching last 5 games, status: ${response.status}`);
    }

    const data = await response.json();
    const games = data.body || [];
    console.log('Fetched Player Game Logs:', JSON.stringify(games, null, 2));

    // Sort games by date ascending and slice the last 5
    const lastFiveGames = games
      .filter(game => game.statType === 'Game') // Ensure it's individual games
      .sort((a, b) => new Date(a.date) - new Date(b.date)) // Sort in ascending order by date
      .slice(-5); // Take only the last 5 games

    console.log('Filtered Last 5 Games:', JSON.stringify(lastFiveGames, null, 2)); // Log to verify

    return lastFiveGames;
  } catch (error) {
    console.error('Error fetching last 5 games:', error);
    return [];
  }
};

// Function to fetch team roster
export const fetchTeamRoster = async (teamId, seasonId, playerId) => {
  console.log(`Fetching roster for teamId: ${teamId}, seasonId: ${seasonId}`); // Debugging line

  try {
    const response = await fetch(`${BASKETBALL_HEAD_API_BASE_URL}/teams/${teamId}/roster/${seasonId}`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': BASKETBALL_HEAD_API_KEY,
        'X-RapidAPI-Host': BASKETBALL_HEAD_API_HOST,
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching team roster, status: ${response.status}`);
    }

    const data = await response.json();
    const playerData = data.body.roster.find(player => player.playerId === playerId);

    // Return the jersey number if the player is found
    return playerData ? playerData.jerseyNumber : 'N/A';
  } catch (error) {
    console.error('Error fetching team roster:', error);
    return 'N/A';
  }
};