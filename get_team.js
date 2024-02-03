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
function extractTeamInfo(data) {
    // Initialize an empty array to store the extracted team information
    const teams = [];
    
    // Iterate over the response array in the JSON data
    data.response.forEach(item => {
        // Extract the team ID and name
        const teamId = item.team.id;
        const teamName = item.team.name;
        
        // Create an object with the extracted information
        const teamInfo = { id: teamId, name: teamName };
        
        // Add the object to the array
        teams.push(teamInfo);
    });
    
    return teams;
}

let jsonData = require('./json_files/temp_json/ligue1_temp.json');

const teamInfoList = extractTeamInfo(jsonData);

// Convert the extracted team information to a JSON string
const teamInfoJsonString = JSON.stringify({ teams: teamInfoList }, null, 4);

// Write the JSON string to a new file named 'team_info.json'
fs.writeFileSync('team_info.json', teamInfoJsonString);

let result = teamInfoJsonString;
console.log(result);