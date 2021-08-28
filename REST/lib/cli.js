const readline = require('readline');
const util = require('util');
const debug = util.debuglog('cli');
const events = require('events');
class _events extends events{};
const e = new _events();
const os = require('os');
const v8 = require('v8');
const _data = require('./data');
const _logs = require('./logs');
const helpers = require('./helpers');
const childProcess = require('child_process');


let cli = {};

e.on('man',function(str) {
    cli.responders.help();
});

e.on('help',function(str) {
    cli.responders.help();
});

e.on('exit',function(str) {
    cli.responders.exit();
});

e.on('stats',function(str) {
    cli.responders.stats();
});

e.on('more user info',function(str) {
    cli.responders.moreUserInfo(str);
});

e.on('list users',function(str) {
    cli.responders.listUsers();
});

e.on('list checks',function(str) {
    cli.responders.listChecks(str);
});

e.on('more check info',function(str) {
    cli.responders.moreCheckInfo(str);
});

e.on('list logs',function(str) {
    cli.responders.listLogs();
});

e.on('more log info',function(str) {
    cli.responders.moreLogInfo(str);
});



cli.responders = {};

cli.responders.help = function() {
    console.log('You asked for help');  
};

cli.responders.exit = function() {
    console.log('You asked for exit');  
};

cli.responders.stats = function() {
    console.log('You asked for stats');  
};

cli.responders.listUsers = function() {
    console.log('You asked for listUsers');  
};

cli.responders.moreUserInfo = function(str) {
    console.log('You asked for moreUserInfo');  
};

cli.responders.listChecks = function(str) {
    console.log('You asked for listChecks');  
};

cli.responders.moreCheckInfo = function(str) {
    console.log('You asked for moreCheckInfo');  
};

cli.responders.listLogs = function() {
    console.log('You asked for listLogs');  
};

cli.responders.moreLogInfo = function(str) {
    console.log('You asked for moreLogInfo');  
};


cli.processInput = function(str) {
    str = typeof(str) == 'string' && str.trim().length > 0 ? str.trim() : false;
    if(str) {
        let uniqueInputs = [
            'man',
            'help',
            'exit',
            'stats',
            'list users',
            'more user info',
            'list checks',
            'more check info',
            'list logs',
            'more log info'
        ];

        let matchFound = false;
        let counter = 0;

        uniqueInputs.some(function(input) {
            if(str.toLowerCase().indexOf(input) > -1) {
                matchFound = true;
                e.emit(input,str);
                return true;
            }
        });

        if(!matchFound) {
            console.log('Try again');
        }
    };
};

cli.init = function() {
    console.log('\x1b[34m%s\x1b[0m','The CLI is running');

    let _interface = readline.createInterface({
        'input' : process.stdin,
        'output' : process.stdout,
        'prompt' : ''
    });

    _interface.prompt();
    _interface.on('line',function(str) {
        cli.processInput(str);
        
        _interface.prompt();
    });

    _interface.on('close',function() {
        process.exit(0);
    });


};


module.exports = cli;