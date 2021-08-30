const server = require('./lib/server');
const workers = require('./lib/workers');
const cli = require('./lib/cli');

const app = {};

app.init = function(callback) {
    server.init();
    workers.init();

    setTimeout(() => {
        cli.init();
        callback();
    }, 50);
};


if(require.main === module) {
    app.init(function() {});
};


module.exports = app;