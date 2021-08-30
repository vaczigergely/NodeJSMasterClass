const server = require('./lib/server');
const workers = require('./lib/workers');
const cli = require('./lib/cli');
const exampleError = require('./lib/exampleError');

const app = {};

app.init = function() {
    debugger;
    server.init();
    debugger;
    workers.init();
    debugger;

    setTimeout(() => {
        cli.init();
    }, 50);
    debugger;
    let foo = 1;
    console.log('Assignet 1 to foo');
    foo++;
    console.log('incremented foo');
    foo = foo*foo;
    console.log('squered foo');
    foo = foo.toString();
    console.log('converted to string');
    exampleError.init();
    console.log('called init');
    debugger;
};

app.init();

module.exports = app;