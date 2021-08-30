const helpers = require('./../lib/helpers');
const assert = require('assert');
const logs = require('./../lib/logs');
const exampleError = require('./../lib/exampleError');


let unit = {};


// Assert that the getANumber function is returning a number
unit['helpers.getANumber should return a number'] = function(done){
    var val = helpers.getANumber();
    assert.strictEqual(typeof(val), 'number');
    done();
  };
  
  // Assert that the getANumber function is returning 1
  unit['helpers.getANumber should return 1'] = function(done){
    var val = helpers.getANumber();
    assert.strictEqual(val, 1);
    done();
  };
  
  // Assert that the getANumber function is returning 2
  unit['helpers.getNumberOne should return 2'] = function(done){
    var val = helpers.getANumber();
    assert.strictEqual(val, 2);
    done();
  };
  
  // Logs.list should callback an array and a false error
  unit['logs.list should callback a false error and an array of log names'] = function(done){
    logs.list(true,function(err,logFileNames){
        assert.strictEqual(err, false);
        assert.ok(logFileNames instanceof Array);
        assert.ok(logFileNames.length > 1);
        done();
    });
  };
  
  // Logs.truncate should not throw if the logId doesnt exist
  unit['logs.truncate should not throw if the logId does not exist, should callback an error instead'] = function(done){
    assert.doesNotThrow(function(){
      logs.truncate('I do not exist',function(err){
        assert.ok(err);
        done();
      })
    },TypeError);
  };
  
  // exampleDebuggingProblem.init should not throw (but it does)
  unit['exampleError.init should not throw when called'] = function(done){
    assert.doesNotThrow(function(){
      exampleError.init();
      done();
    },TypeError);
  };
  


module.exports = unit;