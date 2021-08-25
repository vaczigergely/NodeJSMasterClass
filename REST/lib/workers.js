const path = require('path');
const fs = require('fs');
const _data = require('./data');
const https = require('https');
const http = require('http');
const helpers = require('./helpers');
const url = require('url');


const workers = {};

workers.gatherAllChecks = function() {
    _data.list('checks',function(err,checks) {
        if(!err && checks && checks.length > 0) {
            checks.forEach(function(check) {
                _data.read('checks',check,function(err,originalCheckData) {
                    if(!err && originalCheckData) {
                        workers.validateCheckData(originalCheckData);
                    } else {
                        console.log('Error reading check data');
                    };
                });
            });
        } else {
            console.log('Error while gathering checks');
        };
    });  
};

workers.validateCheckData = function(originalCheckData) {
    originalCheckData = typeof(originalCheckData) == 'object' && originalCheckData !== null ? originalCheckData : {};
    originalCheckData.Id = typeof(originalCheckData.Id) == 'string' && originalCheckData.Id.trim().length >= 19 ? originalCheckData.Id.trim() : false;
    originalCheckData.userPhone = typeof(originalCheckData.userPhone) == 'string' && originalCheckData.userPhone.trim().length == 10 ? originalCheckData.userPhone.trim() : false;
    originalCheckData.protocol = typeof(originalCheckData.protocol) == 'string' && ['http','https'].indexOf(originalCheckData.protocol) > -1 ? originalCheckData.protocol : false;
    originalCheckData.url = typeof(originalCheckData.url) == 'string' && originalCheckData.url.trim().length > 0 ? originalCheckData.url.trim() : false;
    originalCheckData.method = typeof(originalCheckData.method) == 'string' && ['post','get','put','delete'].indexOf(originalCheckData.method) > -1 ? originalCheckData.method : false;
    originalCheckData.successCodes = typeof(originalCheckData.successCodes) == 'object' && originalCheckData.successCodes instanceof Array && originalCheckData.successCodes.length > 0 ? originalCheckData.successCodes : false;
    originalCheckData.timeoutSeconds = typeof(originalCheckData.timeoutSeconds) == 'number' && originalCheckData.timeoutSeconds % 1 === 0 && originalCheckData.timeoutSeconds >= 1 && originalCheckData.timeoutSeconds <= 5 ? originalCheckData.timeoutSeconds : false;
    // Set the keys that may not be set (if the workers have never seen this check before)
    originalCheckData.state = typeof(originalCheckData.state) == 'string' && ['up','down'].indexOf(originalCheckData.state) > -1 ? originalCheckData.state : 'down';
    originalCheckData.lastChecked = typeof(originalCheckData.lastChecked) == 'number' && originalCheckData.lastChecked > 0 ? originalCheckData.lastChecked : false;

    console.log(originalCheckData)
    
      // If all checks pass, pass the data along to the next step in the process
      if(originalCheckData.Id &&
        originalCheckData.userPhone &&
        originalCheckData.protocol &&
        originalCheckData.url &&
        originalCheckData.method &&
        originalCheckData.successCodes &&
        originalCheckData.timeoutSeconds){
          workers.performCheck(originalCheckData);
        } else {
          // If checks fail, log the error and fail silently
          console.log("Error: one of the checks is not properly formatted. Skipping.");
        }
};


workers.performCheck = function(originalCheckData) {
    let checkOutcome = {
        'error' : false,
        'responseCode' : false
    };

    let outcomeSent = false;

    let parsedUrl = url.parse(originalCheckData.protocol + '://' + originalCheckData.url,true);
    let hostName = parsedUrl.hostname;
    let path = parsedUrl.path;

    let requestDetails = {
        'protocol' : originalCheckData.protocol+':',
        'hostname' : hostName,
        'method' : originalCheckData.method.toUpperCase(),
        'path' : path,
        'timeout' : originalCheckData.timeoutSeconds * 1000
    };

    let _moduleToUse = originalCheckData.protocol == 'http' ? http : https;
    let req = _moduleToUse.request(requestDetails,function(res) {
       let status = res.statusCode;
       checkOutcome.responseCode = status;
       
       if(!outcomeSent) {
            workers.processCheckOutcome(originalCheckData,checkOutcome);
            outcomeSent = true;
       };
    });

    req.on('error',function(e) {
        checkOutcome.error = {
            'error' : true,
            'value' : e
        };
        if(!outcomeSent) {
            workers.processCheckOutcome(originalCheckData,checkOutcome);
            outcomeSent = true;
        };
    });

    req.on('timeout',function(e) {
        checkOutcome.error = {
            'error' : true,
            'value' : 'timeout'
        };
        if(!outcomeSent) {
            workers.processCheckOutcome(originalCheckData,checkOutcome);
            outcomeSent = true;
        };
    });

    req.end();
};


workers.processCheckOutcome = function(originalCheckData,checkOutcome) {
    let state = !checkOutcome.error && checkOutcome.responseCode && originalCheckData.successCodes.indexOf(checkOutcome.responseCode) > -1 ? 'up' : 'down';  
    let alertWarranted = originalCheckData.lastChecked && originalCheckData.state !== state ? true : false;

    let newCheckData = originalCheckData;
    newCheckData.state = state;
    newCheckData.lastChecked = Date.now();

    _data.update('checks',newCheckData.Id,newCheckData,function(err) {
       if(!err) {
            if(alertWarranted) {
                workers.alertUserToStatusChange(newCheckData);
            } else {
                console.log('Alert not warranted');
            };
       } else {
           console.log('Error trying to save updade check')
       };
    });
};

workers.alertUserToStatusChange = function(newCheckData) {
    let msg = `Alert: Your check for ${newCheckData.method.toUpperCase()} ${newCheckData.protocol}://${newCheckData.ur} is currently ${newCheckData.state}`;  
    helpers.sendTwilioSms(newCheckData.userPhone,msg,function(err) {
       if(!err) {
        console.log('Success - user was alarted');
       } else {
        console.log('Error: could not sent sms alert to user ',err);
       };
    });
};


workers.loop = function() {
    setInterval(() => {
        workers.gatherAllChecks();
    }, 1000 * 60);
};

workers.init = function() {
    workers.gatherAllChecks();
    
    workers.loop();
};


module.exports = workers;