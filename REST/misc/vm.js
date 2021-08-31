const vm = require('vm');

let context = {
    'foo' : 25
};

let script = new vm.Script(`

    foo = foo * 2;

`);

script.runInNewContext(context);
console.log(context);