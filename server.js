var myHeaders = new Headers();
let json_file = require('./secret_key.json');
secret_key = json_file.api_key;

// get the api key from the secret_key.json(not in the repo for obvious reasons) or 
myHeaders.append("x-apisports-key", secret_key);

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

let playerName = "messi"
fetch(`https://v3.football.api-sports.io/players?search=${playerName}&team=529`, requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));

