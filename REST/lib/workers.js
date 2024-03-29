const path = require('path');
const fs = require('fs');
const _data = require('./data');
const https = require('https');
const http = require('http');
const helpers = require('./helpers');
const url = require('url');
const _logs = require('./logs');
const util = require('util');
const debug = util.debuglog('workers');


const workers = {};

workers.gatherAllChecks = function() {
    _data.list('checks',function(err,checks) {
        if(!err && checks && checks.length > 0) {
            checks.forEach(function(check) {
                _data.read('checks',check,function(err,originalCheckData) {
                    if(!err && originalCheckData) {
                        workers.validateCheckData(originalCheckData);
                    } else {
                        debug('Error reading check data');
                    };
                });
            });
        } else {
            debug('Error while gathering checks');
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

    debug(originalCheckData)
    
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
          debug("Error: one of the checks is not properly formatted. Skipping.");
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

    let timeOfCheck = Date.now();
    workers.log(originalCheckData,checkOutcome,state,alertWarranted,timeOfCheck);
    
    let newCheckData = originalCheckData;
    newCheckData.state = state;
    newCheckData.lastChecked = timeOfCheck;


    

    _data.update('checks',newCheckData.Id,newCheckData,function(err) {
       if(!err) {
            if(alertWarranted) {
                workers.alertUserToStatusChange(newCheckData);
            } else {
                debug('Alert not warranted');
            };
       } else {
           debug('Error trying to save updade check')
       };
    });
};

workers.alertUserToStatusChange = function(newCheckData) {
    let msg = `Alert: Your check for ${newCheckData.method.toUpperCase()} ${newCheckData.protocol}://${newCheckData.ur} is currently ${newCheckData.state}`;  
    helpers.sendTwilioSms(newCheckData.userPhone,msg,function(err) {
       if(!err) {
        debug('Success - user was alarted');
       } else {
        debug('Error: could not sent sms alert to user ',err);
       };
    });
};


workers.log = function(originalCheckData,checkOutcome,state,alertWarranted,timeOfCheck) {
    let logData = {
        'check' : originalCheckData,
        'outcome' : checkOutcome,
        'state' : state,
        'alert' : alertWarranted,
        'time' : timeOfCheck
    };

    let logString = JSON.stringify(logData);

    let logFileName = originalCheckData.Id;
    _logs.append(logFileName,logString,function(err) {
        if(!err) {
            debug('logging to file succeded');
        } else {
            debug('logging to file failed');
        };
    });
};

workers.loop = function() {
    setInterval(() => {
        workers.gatherAllChecks();
    }, 1000 * 60);
};

workers.rotateLogs = function() {
    _logs.list(false,function(err,logs) {
        if(!err && logs && logs.length > 0) {
            logs.forEach(function(logName) {
                let logId = logName.replace('.log','');
                let newFileId = logId+'-'+Date.now();
                _logs.compress(logId,newFileId,function(err) {
                    if(!err) {
                        _logs.truncate(logId,function(err) {
                            if(!err) {
                                debug('Success truncating logfile');
                            } else {
                                debug('Error truncating logfile');
                            };
                        });
                    } else {
                        debug('Error compressing one of the log files',err);
                    };
                });
            });
        } else {
            debug('Error: could not find any logs to rotate');
        };
    });  
};

workers.logRotationLoop = function() {
    setInterval(() => {
        workers.rotateLogs();
    }, 1000 * 60 * 60 * 24);
};

workers.init = function() {
    console.log('\x1b[33m%s\x1b[0m','Background workers are running');

    workers.gatherAllChecks();
    
    workers.loop();

    workers.rotateLogs();
    workers.logRotationLoop();
};


module.exports = workers;