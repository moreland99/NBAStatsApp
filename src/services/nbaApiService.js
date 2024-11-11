// src/services/nbaApiService.js

import { BASKETBALL_HEAD_API_KEY, BASKETBALL_HEAD_API_HOST } from '@env';

const BASKETBALL_HEAD_API_BASE_URL = 'https://basketball-head.p.rapidapi.com';

// Function to search players by name
export const searchPlayers = async (playerName) => {
  try {
    const url = `${BASKETBALL_HEAD_API_BASE_URL}/players/searchv2`;
    console.log(`Request URL: ${url}`);

    const response = await fetch(url, {
      method: 'POST',  // Use POST instead of GET
      headers: {
        'Content-Type': 'application/json',  // Set Content-Type to application/json
        'X-RapidAPI-Key': BASKETBALL_HEAD_API_KEY,
        'X-RapidAPI-Host': BASKETBALL_HEAD_API_HOST
      },
      body: JSON.stringify({ query: playerName })  // Send player name in the body as JSON
    });

    console.log('Response Status:', response.status); // Log status for debugging

    if (!response.ok) throw new Error(`Failed to fetch players, status: ${response.status}`);

    const data = await response.json();
    console.log('Player Search API Response:', data);

    // Adjust to access `data.body` if that is where the array of players is located
    return data.body || [];  // Using `data.body` based on observed structure
  } catch (error) {
    console.error('Error searching players:', error);
    return [];
  }
};

// Function to fetch player statistics for the current season
export const fetchPlayerStats = async (playerId) => {
  try {
    const response = await fetch(`https://basketball-head.p.rapidapi.com/players/${playerId}/stats/Totals?seasonType=Regular`, {
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
    console.log('Fetched Player Stats:', data);
    return data;
  } catch (error) {
    console.error('Error fetching player stats:', error);
    return null;
  }
};


