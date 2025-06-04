const fs = require('fs');
const filePath = 'temp.json';

const apiKey = "386efbd8fc1d4375c4add8b8a2ff409f";
const leagueId = 140;   // Example: La Liga
const season = 2024;
const team = 541;

const baseUrl = `https://v3.football.api-sports.io/players?season=${season}&league=${leagueId}&page=`;
const baseUrl2 = `https://v3.football.api-sports.io/players?season=${season}&team=${team}&page=`;

const headers = {
  "x-rapidapi-host": "v3.football.api-sports.io",
  "x-rapidapi-key": apiKey
};

async function fetchAllPlayers() {
  let allPlayers = [];
  let currentPage = 1;
  let totalPages = 1; // will be updated from API

  while (currentPage <= totalPages) {
    const url = baseUrl2 + currentPage;
    console.log(`Fetching page ${currentPage}...`);

    const response = await fetch(url, { method: "GET", headers });
    const data = await response.json();

    if (data.response && Array.isArray(data.response)) {
      allPlayers.push(...data.response);
    }

    // Update total pages from paging info
    totalPages = data.paging?.total || 1;
    currentPage++;
  }

  // Save all players to file
  fs.writeFileSync(filePath, JSON.stringify({
    league: leagueId,
    season: season,
    players: allPlayers
  }, null, 2));

  console.log(`Saved ${allPlayers.length} players to ${filePath}`);
}

fetchAllPlayers().catch(err => {
  console.error("Error fetching players:", err);
});
