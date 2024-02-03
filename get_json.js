var myHeaders = new Headers();
let json_file = require('./json_files/secret_key.json');
secret_key = json_file.api_key;

// get the api key from the secret_key.json(not in the repo for obvious reasons) or 
myHeaders.append("x-apisports-key", secret_key);

const fs = require('fs');

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

function get_tm_pl(callback) {
  fs.readFile('json_files/leagues.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return callback(err, null);
    }
  
    // Parse the JSON data
    try {
      const jsonData = JSON.parse(data);
      const league_arr = [];
      for (const key in jsonData) {
        const value = jsonData[key];
        league_arr.push(value);
      }
      callback(null, league_arr);
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      callback(parseError, null);
    }
  });
}

// Function to extract names and IDs of clubs
function extractClubs(response) {
  const clubs = [];
  for (const key in response) {
    const team = response[key];
    const club = {
      id: team.id,
      name: team.name
    };
    clubs.push(club);
  }
  console.log(clubs)
  return clubs;
}

// Usage
get_tm_pl((err, leagues) => {
  if (err) {
    console.error('Error:', err);
    return;
  }
  league_id = parseInt(leagues[1]);
  fetch(`https://v3.football.api-sports.io/teams?league=${league_id}&season=2023&`
  , requestOptions)
  .then(response => extractClubs(response))
  .catch(error => console.log('error', error));
});