// TEST RUNNER

_app = {};

_app.tests = {};
_app.tests.unit = require('./unit');


_app.countTests = function() {
    let counter = 0;
    for(let key in _app.tests) {
        if(_app.tests.hasOwnProperty(key)) {
            let subtTest = _app.tests[key];
            for(let testName in subtTest) {
                if(subtTest.hasOwnProperty(testName)) {
                    counter++;
                }
            }
        }
    } 
    return counter; 
};

_app.runTests = function() {
    let errors = [];
    let successes = 0;
    let limit = _app.countTests();
    let counter = 0;
    for(let key in _app.tests) {
        if(_app.tests.hasOwnProperty(key)) {
            let subTest = _app.tests[key];
            for(let testName in subTest) {
                if(subTest.hasOwnProperty(testName)) {
                    (function() {
                        let tmptestName = testName;
                        let testValue = subTest[testName];

                        try {
                            testValue(function() {
                                console.log('\x1b[32m%s\x1b[0m',tmptestName);
                                counter++;
                                successes++;
                                if(counter == limit) {
                                    _app.produceTestReport(limit,successes,errors)
                                } 
                            });
                        } catch (e) {
                            errors.push({
                                'name' : testName,
                                'error' : e
                            });
                            console.log('\x1b[31m%s\x1b[0m',tmptestName);
                            counter++;
                            if(counter == limit) {
                                _app.produceTestReport(limit,successes,errors)
                            } 
                        }
                    })();
                }
            }
        }
    }
};


_app.produceTestReport = function(limit,successes,errors) {
    console.log("");
    console.log("------------------------ BEGIN TEST REPORT ------------------------");
    console.log("");
    console.log('Total Tests: ',limit);
    console.log('Pass: ',successes);
    console.log('Fail: ',errors.length);
    console.log("");

    if(errors.length > 0) {
        console.log("------------------------ BEGIN ERROR DETAILS------------------------");
        console.log("");

        errors.forEach(function(testError) {
            console.log('\x1b[31m%s\x1b[0m',testError.name);
            console.log(testError.error);
        });

        console.log("");
        console.log("------------------------ END ERROR DETAILS------------------------");
    };

    console.log("");
    console.log("------------------------ END TEST REPORT ------------------------");
}


_app.runTests();