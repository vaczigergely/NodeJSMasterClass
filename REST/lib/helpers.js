// Dependencies
const config = require('./config');
const crypto = require('crypto');
const https = require('https');
const querystring = require('querystring');
const path = require('path');
const fs = require('fs');

// Container for all the helpers
const helpers = {};


// Sample for testing
helpers.getANumber = function() {
    return 1;
};


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


helpers.sendTwilioSms = function(phone,msg,callback) {
  phone = typeof(phone) == 'string' && phone.trim().length == 10 ? phone.trim() : false;
  msg = typeof(msg) == 'string' && msg.trim().length > 0 && msg.trim().length < 1600 ? msg.trim() : false;

  if(phone && msg) {
    let payload = {
      'From' : config.twilio.fromPhone,
      'To' : '+36'+phone,
      'Body' : msg
    };

    let stringPayload = querystring.stringify(payload);
    let requestDetails = {
      'protocol' : 'https:',
      'hostname' : 'api.twilio.com',
      'method' : 'POST',
      'path' : '/2010-04-01/Accounts/'+config.twilio.accountSid+'/Messages.json',
      'auth' : config.twilio.accountSid+':'+config.twilio.authToken,
      'headers' : {
        'Content-Type' : 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(stringPayload)
      }
    };

    let req = https.request(requestDetails,function(res){
      // Grab the status of the sent request
      var status =  res.statusCode;
      // Callback successfully if the request went through
      if(status == 200 || status == 201){
        callback(false);
      } else {
        callback('Status code returned was '+status);
      }
    });

    req.on('error',function(e) {
      callback(e);
    });

    req.write(stringPayload);

    req.end();

  } else {
    callback('Given parameters invalid');
  };
};


helpers.getTemplate = function(templateName,data,callback) {
  templateName = typeof(templateName) == 'string' && templateName.length > 0 ? templateName : false;
  data = typeof(data) == 'object' && data !== null ? data : {};
  if(templateName) {
    
    let templatesDir = path.join(__dirname+'/../templates');

    fs.readFile(templatesDir+'/'+templateName+'.html','utf8',function(err,str) {
      if(!err && str && str.length > 0) {
        let finalString = helpers.interpolate(str,data);
        callback(false,finalString);
      } else {
        callback('No template could be found');
      };
    });
  } else {
    callback('A valid templatename was not specified');
  };
};


helpers.addUniversalTemplates = function(str,data,callback) {
  str = typeof(str) == 'string' && str.length > 0 ? str : '';
  data = typeof(data) == 'object' && data !== null ? data : {};
  
  helpers.getTemplate('_header',data,function(err,headerString) {
      if(!err && headerString) {
        helpers.getTemplate('_footer',data,function(err,footerString) {
            if(!err && footerString) {
              let fullString = headerString + str + footerString;
              callback(false,fullString);
            } else {
              callback('Error: could not find the footer template');
            };
        });
      } else {
        callback('Could not find the header template');
      }
  });
};


helpers.interpolate = function(str,data) {
    str = typeof(str) == 'string' && str.length > 0 ? str : '';
    data = typeof(data) == 'object' && data !== null ? data : {};

    for(let keyName in config.templateGlobals) {
      if(config.templateGlobals.hasOwnProperty(keyName)) {
        data['global.'+keyName] = config.templateGlobals[keyName];
      };
    };

    for(let key in data) {
      if(data.hasOwnProperty(key) && typeof(data[key]) == 'string') {
        let replace = data[key];
        let find = '{' + key + '}';
        str = str.replace(find,replace);
      };
    };
    return str;
};


helpers.getStaticAsset = function(fileName,callback) {
  fileName = typeof(fileName) == 'string' && fileName.length > 0 ? fileName : false; 
  if(fileName) {
      let publicDir = path.join(__dirname,'/../public/');
      fs.readFile(publicDir + fileName, function(err,data) {
          if(!err && data) {
              callback(false,data);
          } else {
              callback('No file could be found');
          ;}
      });
  } else {
      callback('A valid filename was not specified');
  };
};


// Export the module
module.exports = helpers;