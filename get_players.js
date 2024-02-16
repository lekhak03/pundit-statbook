
// script to get players based on team id in leagues and store it.

// requests options
var myHeaders = new Headers();
let json_file = require('./json_files/secret_key.json');
secret_key = json_file.api_key;
// get the api key from the secret_key.json(not in the repo for obvious reasons) or 
myHeaders.append("x-apisports-key", secret_key);

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

// file system and json_data
const fs = require('fs');
const file_path = './json_files/leagues/epl.json';
const jsonData = require(file_path);


// fn to request api to get squad using team id.
function extractPlayers(jsonData, file_path) {
    let fetchPromises = [];

    jsonData.teams.forEach((team, index) => {
        let teamId = team.id;
        teamId = parseInt(teamId);

        // Construct the URL for the API call
        let url = `https://v3.football.api-sports.io/players/squads?team=${teamId}`;

        // Add the fetch promise to the array
        fetchPromises.push(fetch(url, requestOptions));
    });

    // Use Promise.all to wait for all fetch requests to complete
    Promise.all(fetchPromises).then(responses => {
        // Map the responses to JSON
        return Promise.all(responses.map(response => response.json()));
    }).then(data => {
        // 'data' is now an array of JSON responses
        // Process each item to access the 'response' key
        data.forEach((item, index) => {
            // Check if the 'response' key exists and contains an array
            if (item.hasOwnProperty('response') && Array.isArray(item.response)) {
                try {
                    const responseObject = item.response[0];
                    // Update the corresponding team in jsonData with the players data
                    jsonData.teams[index].players = responseObject.players;
                }
                catch (e) {
                    console.log(`FAILED TO RETRIEVE THE FOLLOWING DATA of index ${index}: ${item.response}`)
                }
            } else {
                console.error('Response key not found or not an array');
            }
        });
        
        // Write the updated jsonData to the file
        fs.writeFileSync(file_path, JSON.stringify(jsonData, null, 2), 'utf8');
    }).catch(error => {
        // Handle any errors that occurred during the fetch
        console.error('Error fetching player data:', error);
    });
}
extractPlayers(jsonData, file_path);
