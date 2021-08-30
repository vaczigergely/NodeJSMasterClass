const server = require('./lib/server');
const workers = require('./lib/workers');
const cli = require('./lib/cli');
const cluster = require('cluster');
const os = require('os');

const app = {};

app.init = function(callback){

    // If we're on the master thread, start the background workers and the CLI
    if(cluster.isMaster){
  
      // Start the workers
      workers.init();
  
      // Start the CLI, but make sure it starts last
      setTimeout(function(){
        cli.init();
        callback();
      },50);
  
      // Fork the process
      for(let i = 0; i < os.cpus().length; i++){
        cluster.fork();
      }
  
    } else {
      // If we're not on the master thread, start the HTTP server
      server.init();
    }
  };


if(require.main === module) {
    app.init(function() {});
};


module.exports = app;