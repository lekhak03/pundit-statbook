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