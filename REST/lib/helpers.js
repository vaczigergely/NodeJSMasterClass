// Dependencies
const config = require('./config');
const crypto = require('crypto');

// Container for all the helpers
const helpers = {};

// Parse a JSON string to an object in all cases, without throwing
helpers.parseJsonToObject = function(str){
  try{
    let obj = JSON.parse(str);
    return obj;
  } catch(e){
    return {};
  };
};

// Create a SHA256 hash
helpers.hash = function(str){
  if(typeof(str) == 'string' && str.length > 0){
    let hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
    return hash;
  } else {
    return false;
  };
};

helpers.createRandomString = function(strLength) {
    strLength = typeof(strLength) == 'number' && strLength > 0 ? strLength : false

    if(strLength) {
        const possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let str = '';
        for(i = 1; i < strLength; i++) {
            let randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
            str += randomCharacter;
        }

        return str;
    } else {
        return false;
    };
};



// Export the module
module.exports = helpers;