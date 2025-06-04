// player_stats_fetcher.js

const fs = require('fs');
const path = './json_files/player_stats.json';

// Load API key securely from json file
const { api_key } = require('../json_files/secret_key.json');

// API request setup
const headers = {
  "x-apisports-key": api_key
};

const requestOptions = {
  method: 'GET',
  headers: headers,
  redirect: 'follow'
};

// Define your API endpoint parameters
const leagueId = 140;      // Example: English Premier League
const seasonYear = 2024;  // Target season

// API endpoint with pagination support
const BASE_URL = `https://v3.football.api-sports.io/players?season=${seasonYear}&league=${leagueId}&page=`;

// Main function to fetch all pages of data
async function fetchAllPlayerStats() {
  let currentPage = 1;
  let allPlayers = [];

  while (true) {
    const response = await fetch(BASE_URL + currentPage, requestOptions);
    const data = await response.json();

    if (data.response && data.response.length > 0) {
        console.loog(data.response)
      allPlayers.push(...data.response);
      currentPage += 1;
    } else {
      break;
    }
  }

  // Save the combined data to a file
  fs.writeFileSync(path, JSON.stringify({ league: leagueId, season: seasonYear, players: response }, null, 2), 'utf8');
  console.log(`Player stats saved to ${path}`);
}

// Run the fetcher
fetchAllPlayerStats().catch(error => {
  console.error("Error fetching player stats:", error);
});
