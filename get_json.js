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

// leagues json -top 5
function get_leagues(requestOptions) {
  fetch(`https://v3.football.api-sports.io/leagues?id=39`, requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
}

function get_teams(requestOptions) {

}

function get_players(requestOptions) {
  
}

get_leagues(requestOptions)