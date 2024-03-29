const { fstat } = require('fs');
const path = require('path');
const config = require('./config');
const _data = require('./data');
const helpers = require('./helpers');
const { URL } = require('url');
const dns = require('dns');
const { performance, PerformanceObserver } = require('perf_hooks');
const util = require('util');
const debug = util.debuglog('performance');

const handlers = {};

handlers.index = function(data,callback) {
    if(data.method == 'get') {

        let templateData = {
            'head.title' : 'Uptime Monitoring',
            'head.description' : 'Uptime Monitoring for http and https sites',
            'body.class' : 'index'
        };

        helpers.getTemplate('index',templateData,function(err,str) {
            if(!err && str) {
                helpers.addUniversalTemplates(str,templateData,function(err,str) {
                    if(!err && str) {
                        callback(200,str,'html');
                    } else {
                        callback(500,undefined,'html');
                    };
                });
            } else {
                callback(500,undefined,'html');
            };
        });
    } else {
        callback(405,undefined,'html');
    };
};


handlers.accountCreate = function(data,callback) {
    if(data.method == 'get') {

        let templateData = {
            'head.title' : 'Create an account',
            'head.description' : 'Signup is easy',
            'body.class' : 'accountCreate'
        };

        helpers.getTemplate('accountCreate',templateData,function(err,str) {
            if(!err && str) {
                helpers.addUniversalTemplates(str,templateData,function(err,str) {
                    if(!err && str) {
                        callback(200,str,'html');
                    } else {
                        callback(500,undefined,'html');
                    };
                });
            } else {
                callback(500,undefined,'html');
            };
        });
    } else {
        callback(405,undefined,'html');
    };
};

handlers.sessionCreate = function(data,callback) {
    if(data.method == 'get') {

        let templateData = {
            'head.title' : 'Login to your account',
            'head.description' : 'Enter phone number and password',
            'body.class' : 'sessionCreate'
        };

        helpers.getTemplate('sessionCreate',templateData,function(err,str) {
            if(!err && str) {
                helpers.addUniversalTemplates(str,templateData,function(err,str) {
                    if(!err && str) {
                        callback(200,str,'html');
                    } else {
                        callback(500,undefined,'html');
                    };
                });
            } else {
                callback(500,undefined,'html');
            };
        });
    } else {
        callback(405,undefined,'html');
    };
};

handlers.sessionDeleted = function(data,callback) {
    if(data.method == 'get') {

        let templateData = {
            'head.title' : 'Logged out',
            'head.description' : 'You have been logged out',
            'body.class' : 'sessionDeleted'
        };

        helpers.getTemplate('sessionDeleted',templateData,function(err,str) {
            if(!err && str) {
                helpers.addUniversalTemplates(str,templateData,function(err,str) {
                    if(!err && str) {
                        callback(200,str,'html');
                    } else {
                        callback(500,undefined,'html');
                    };
                });
            } else {
                callback(500,undefined,'html');
            };
        });
    } else {
        callback(405,undefined,'html');
    };
};


handlers.accountEdit = function(data,callback) {
    if(data.method == 'get') {

        let templateData = {
            'head.title' : 'Account Settings',
            'body.class' : 'accountEdit'
        };

        helpers.getTemplate('accountEdit',templateData,function(err,str) {
            if(!err && str) {
                helpers.addUniversalTemplates(str,templateData,function(err,str) {
                    if(!err && str) {
                        callback(200,str,'html');
                    } else {
                        callback(500,undefined,'html');
                    };
                });
            } else {
                callback(500,undefined,'html');
            };
        });
    } else {
        callback(405,undefined,'html');
    };
};

handlers.checksCreate = function(data,callback) {
    if(data.method == 'get') {

        let templateData = {
            'head.title' : 'create a new check',
            'body.class' : 'checksCreate'
        };

        helpers.getTemplate('checksCreate',templateData,function(err,str) {
            if(!err && str) {
                helpers.addUniversalTemplates(str,templateData,function(err,str) {
                    if(!err && str) {
                        callback(200,str,'html');
                    } else {
                        callback(500,undefined,'html');
                    };
                });
            } else {
                callback(500,undefined,'html');
            };
        });
    } else {
        callback(405,undefined,'html');
    };
};


handlers.checksEdit = function(data,callback) {
    if(data.method == 'get') {

        let templateData = {
            'head.title' : 'Edit your checks',
            'body.class' : 'checksEdit'
        };

        helpers.getTemplate('checksEdit',templateData,function(err,str) {
            if(!err && str) {
                helpers.addUniversalTemplates(str,templateData,function(err,str) {
                    if(!err && str) {
                        callback(200,str,'html');
                    } else {
                        callback(500,undefined,'html');
                    };
                });
            } else {
                callback(500,undefined,'html');
            };
        });
    } else {
        callback(405,undefined,'html');
    };
};


handlers.checksList = function(data,callback) {
    if(data.method == 'get') {

        let templateData = {
            'head.title' : 'List of your checks',
            'head.description' : 'List of your checks',
            'body.class' : 'checksList'
        };

        helpers.getTemplate('checksList',templateData,function(err,str) {
            if(!err && str) {
                helpers.addUniversalTemplates(str,templateData,function(err,str) {
                    if(!err && str) {
                        callback(200,str,'html');
                    } else {
                        callback(500,undefined,'html');
                    };
                });
            } else {
                callback(500,undefined,'html');
            };
        });
    } else {
        callback(405,undefined,'html');
    };
};


handlers.accountDeleted = function(data,callback) {
    if(data.method == 'get') {

        let templateData = {
            'head.title' : 'Account deleted',
            'head.description' : 'Account has been deleted',
            'body.class' : 'accountDeleted'
        };

        helpers.getTemplate('accountDeleted',templateData,function(err,str) {
            if(!err && str) {
                helpers.addUniversalTemplates(str,templateData,function(err,str) {
                    if(!err && str) {
                        callback(200,str,'html');
                    } else {
                        callback(500,undefined,'html');
                    };
                });
            } else {
                callback(500,undefined,'html');
            };
        });
    } else {
        callback(405,undefined,'html');
    };
};


handlers.favicon = function(data,callback) {
    if(data.method == 'get') {
        helpers.getStaticAsset('favicon.ico',function(err,data) {
            if(!err && data) {
                callback(200,data,'favicon');
            } else {
                callback(500);
            };
        });
    } else {
        callback(405);
    };
};


handlers.public = function(data,callback) {
    if(data.method == 'get') {
        let trimmedAssetName = data.trimmedPath.replace('public/','').trim();
        if(trimmedAssetName.length > 0) {
            helpers.getStaticAsset(trimmedAssetName,function(err,data) {
                if(!err && data) {
                    let contentType = 'plain';
                    if(trimmedAssetName.indexOf('css') > -1) {
                        contentType = 'css';
                    };
                    if(trimmedAssetName.indexOf('png') > -1) {
                        contentType = 'png';
                    };
                    if(trimmedAssetName.indexOf('jpg') > -1) {
                        contentType = 'jpg';
                    };
                    if(trimmedAssetName.indexOf('ico') > -1) {
                        contentType = 'favicon';
                    };

                    callback(200,data,contentType);
                } else {
                    callback(404);
                };
            });
        } else {
            callback(404);
        };
    } else {
        callback(405);
    };
};
//

handlers.users = function(data, callback) {
    
    const acceptableMethods = ['post', 'get', 'put', 'delete'];
    if(acceptableMethods.indexOf(data.method) > -1) {
        handlers._users[data.method](data, callback);
    } else {
        callback(405);
    }
};

handlers._users = {};

handlers._users.post = function(data,callback) {
    const firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    const lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    const phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
    const password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    const tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false;

    
    if(firstName && lastName && phone && password && tosAgreement) {
        _data.read('users',phone,function(err,data) {
            if(err) {
                const hashedPassword = helpers.hash(password);
                if(hashedPassword) {
                    const userObject = {
                        'firstName' : firstName,
                        'lastName' : lastName,
                        'phone' : phone,
                        'password' : hashedPassword,
                        'tosAgreement' : true
                    };
    
                    _data.create('users',phone,userObject,function(err) {
                        if(!err) {
                            callback(200);
                        } else {
                            console.log(err);
                            callback(500,{ 'Error' : 'Could not create the new user' });
                        }
                    })
                } else {
                    callback(500,{ 'Error' : 'Could not hash the password' });
                }
                
            } else {
                callback(400,{ 'key' : 'User already exists' });
            }
        });
    } else {
        callback(400, { 'Error' : 'Missing required fields' });
    };
};

handlers._users.get = function(data,callback) {
    const phone = typeof(data.queryStringObject.phone) == "string" && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() : false;
    if(phone) {
        
        const token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
        
        handlers._tokens.verifyToken(token,phone,function(tokenIsValid) {
            if(tokenIsValid) {
                _data.read('users',phone,function(err,data) {
                    if(!err && data) {
                        delete data.password;
                        callback(200,data);
                    } else {
                        callback(404);
                    };
                })
            } else {
                callback(403, { 'Error' : 'Missing required token' })
            }
        });
    } else {
        callback(400,{ 'Error' : 'Missing required field' });
    };
};

handlers._users.put = function(data,callback) {
    const phone = typeof(data.payload.phone) == "string" && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;

    const firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    const lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    const password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

    if(phone) {
        if(firstName || lastName || password) {

            const token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
            handlers._tokens.verifyToken(token,phone,function(tokenIsValid) {
                if(tokenIsValid) {
                    _data.read('users',phone,function(err,userData) {
                        if(!err && userData) {
                            if(firstName) {
                                userData.firstName = firstName;
                            }
                            if(lastName) {
                                userData.lastName = lastName;
                            }
                            if(password) {
                                userData.hashedPassword = helpers.hash(password);
                            }
        
                            _data.update('users',phone,userData,function(err) {
                                if(!err) {
                                    callback(200);
                                } else {
                                    callback(500,{ 'Error' : 'Could not update the user' });
                                };
                            });
                        } else {
                            callback(400,{ 'Error' : 'The specified user does not exists' });
                        };
                    })
                } else {
                    callback(403, { 'Error' : 'Missing required token' });
                }
            });           
        } else {
            callback(400,{ 'Error' : 'Missing fields' })
        }
    } else {
        callback(400,{ 'Error' : 'Missing required field' });
    };
};

handlers._users.delete = function(data,callback) {
    const phone = typeof(data.queryStringObject.phone) == "string" && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() : false;
    if(phone) {
        const token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
        handlers._tokens.verifyToken(token,phone,function(tokenIsValid) {
            if(tokenIsValid) {
                _data.read('users',phone,function(err,userData) {
                    if(!err && userData) {
                        _data.delete('users',phone,function(err) {
                           if(!err) {

                            let userChecks = typeof(userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : [];
                            let checksToDelete = userChecks.length;

                            if(checksToDelete > 0) {
                                let checksDeleted = 0;
                                let deletionErrors = false;

                                userChecks.forEach(function(checkId) {
                                    _data.delete('checks',checkId,function(err) {
                                        if(err) {
                                            deletionErrors = true;
                                        };

                                        checksDeleted++;
                                        if(checksDeleted == checksToDelete) {
                                            if(!deletionErrors) {
                                                callback(200);
                                            } else {
                                                callback(500, { 'Error' : 'Error during user check deletion' });
                                            };
                                        };
                                    });
                                });
                            } else {
                                callback(200);
                            };

                           } else {
                               callback(500,{ 'Error' : 'Could not delete specified user' });
                           }
                        });
                    } else {
                        callback(400,{ 'Error' : 'Could not find the specified user' });
                    };
                });
            } else {
                callback(403, { 'Error' : 'Missing required token' });
            };
        });    
    } else {
        callback(400,{ 'Error' : 'Missing required field' });
    };
};



handlers.tokens = function(data, callback) {
    const acceptableMethods = ['post', 'get', 'put', 'delete'];
    if(acceptableMethods.indexOf(data.method) > -1) {
        handlers._tokens[data.method](data, callback);
    } else {
        callback(405);
    }
};

handlers._tokens = {};

handlers._tokens.post = function(data,callback) {
    performance.mark('entered function');
    const phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
    const password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    performance.mark('inputs validated');
    if(phone && password) {
        performance.mark('beginning user lookup');
        _data.read('users',phone,function(err,userData) {
            performance.mark('user lookup done');
            if(!err && userData) {
                performance.mark('beginning password hashing');
                const hashedPassword = helpers.hash(password);
                performance.mark('finished password hashing');
                if(hashedPassword == userData.password) {
                    //TODO Why it is giving back 19 characters instead of 20
                    performance.mark('creating data for the token');
                    const tokenId = helpers.createRandomString(20);
                    const expires =Date.now() * 1000 * 60 * 60;
                    const tokenObject = {
                        'phone' : phone,
                        'id' : tokenId,
                        'expires' : expires
                    }

                    performance.mark('beginning storing token');
                    _data.create('tokens',tokenId,tokenObject,function(err) {
                        performance.mark('storing token complete');

                        const obs = new PerformanceObserver((list, observer) => {
                            console.log(list.getEntriesByType('measure'));
                            observer.disconnect();
                        });
                        obs.observe({ entryTypes: ['measure'], buffered: true });

                        performance.measure('Beginning to end','entered function','storing token complete');
                        performance.measure('Validating user input','entered function','inputs validated');
                        performance.measure('User lookup','beginning user lookup','user lookup done');
                        performance.measure('Password hasing','beginning password hashing','finished password hashing');
                        performance.measure('Token data creation','creating data for the token','beginning storing token');
                        performance.measure('Token storing','beginning storing token','storing token complete');

                        if(!err) {
                            callback(200,tokenObject);
                        } else {
                            callback(500,{ 'Error' : 'Could not create the token' });
                        };
                    });
                } else {
                    callback(400,{ 'Error' : 'Password did not match' });
                }
            } else {
                callback(400,{ 'Error' : 'Could not find user' });
            };
        });
    } else {
        callback(400,{ 'Error' : 'Missing required fields' });
    };
};


handlers._tokens.get = function(data,callback) {
    const id = typeof(data.queryStringObject.id) == "string" && data.queryStringObject.id.trim().length <= 19 ? data.queryStringObject.id.trim() : false;
    if(id) {
        _data.read('tokens',id,function(err,tokenData) {
            if(!err && tokenData) {
                callback(200,tokenData);
            } else {
                callback(404,err);
            };
        })
    } else {
        callback(400,{ 'Error' : 'Missing required field' });
    };
};


handlers._tokens.put = function(data,callback) {
    const id = typeof(data.payload.id) == "string" && data.payload.id.trim().length <= 19 ? data.payload.id.trim() : false;
    const extend = typeof(data.payload.extend) == "boolean" && data.payload.extend == true ? true : false;
   
    if(id && extend) {
        _data.read('tokens',id,function(err,tokenData) {
            if(!err && tokenData) {
                if(tokenData.expires > Date.now()) {
                    tokenData.expires = Date.now() + 1000 * 60 * 60;

                    _data.update('tokens',id,tokenData,function(err) {
                        if(!err) {
                            callback(200);
                        } else {
                            callback(500,{ 'Error' : 'Could not update the token' });
                        };
                    });
                } else {
                    callback(400,{ 'Error' : 'The token has already expired' });
                };
            } else {
                callback(400,{ 'Error' : 'The specified token does not exists' });
            };
        });
    } else {
        callback(400,{ 'Error' : 'Missing required field or it is invalid' });
    };
};

handlers._tokens.delete = function(data,callback) {
    const id = typeof(data.queryStringObject.id) == "string" && data.queryStringObject.id.trim().length <= 19 ? data.queryStringObject.id.trim() : false;
    if(id) {
        _data.read('tokens',id,function(err,tokenData) {
            if(!err && tokenData) {
                _data.delete('tokens',id,function(err) {
                   if(!err) {
                       callback(200);
                   } else {
                       callback(500,{ 'Error' : 'Could not delete token' });
                   }
                });
            } else {
                callback(400,{ 'Error' : 'Could not find the specified token' });
            };
        })
    } else {
        callback(400,{ 'Error' : 'Missing required field' });
    };
};


handlers._tokens.verifyToken = function(id,phone,callback) {
    _data.read('tokens',id,function(err,tokenData) {
        if(!err && tokenData) {
            if(tokenData.phone == phone && tokenData.expires > Date.now()) {
                callback(true);
            } else {
                callback(false);
            };
        } else {
            callback(false);
        };
    })
}



handlers.checks = function(data, callback) {
    const acceptableMethods = ['post', 'get', 'put', 'delete'];
    if(acceptableMethods.indexOf(data.method) > -1) {
        handlers._checks[data.method](data, callback);
    } else {
        callback(405);
    };
};

handlers._checks = {};

handlers._checks.post = function(data,callback) {
    const protocol = typeof(data.payload.protocol) == 'string' && ['https','http'].indexOf(data.payload.protocol) > -1 ? data.payload.protocol : false;
    const url = typeof(data.payload.url) == 'string' && data.payload.url.trim().length > 0 ? data.payload.url.trim() : false;
    const method = typeof(data.payload.method) == 'string' && ['post','get','put','delete'].indexOf(data.payload.method) > -1 ? data.payload.method : false;
    const successCodes = typeof(data.payload.successCodes) == 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0 ? data.payload.successCodes : false;
    const timeoutSeconds = typeof(data.payload.timeoutSeconds) == 'number' && data.payload.timeoutSeconds % 1 === 0 &&  data.payload.timeoutSeconds >= 1 && data.payload.timeoutSeconds <= 5 ? data.payload.timeoutSeconds : false;

    if(protocol && url && method && successCodes && timeoutSeconds) {
        const token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

        _data.read('tokens',token,function(err,tokenData){
            if(!err && tokenData) {
                let userPhone = tokenData.phone;

                _data.read('users',userPhone,function(err,userData){
                    if(!err && userData) {
                        let userChecks = typeof(userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : [];

                        if(userChecks.length < config.maxChecks) {
                            let parsedUrl = new URL(protocol+'://'+url,true);
                            let hostName = typeof(parsedUrl.hostname) == 'string' && parsedUrl.hostname.length > 0 ? parsedUrl.hostname : false;
                            dns.resolve(hostName,function(err,records) {
                                if(!err && records) {
                                    let checkId = helpers.createRandomString(20);

                                    let checkObject = {
                                        'Id' : checkId,
                                        'userPhone' : userPhone,
                                        'protocol' : protocol,
                                        'url' : url,
                                        'method' : method,
                                        'succesCodes' : successCodes,
                                        'timeoutSeconds' : timeoutSeconds
                                    };

                                    _data.create('checks',checkId,checkObject,function(err){
                                        if(!err) {
                                            userData.checks = userChecks;
                                            userData.checks.push(checkId);

                                            _data.update('users',userPhone,userData,function(err) {
                                                if(!err) {
                                                    callback(200,checkObject);
                                                } else {
                                                    callback(500,{ 'Error' : 'Could not update the user' });
                                                };
                                            })
                                        } else {
                                            callback(500,{ 'Error' : 'Could not create new check' });
                                        };
                                    });
                                } else {
                                    callback(400,{ 'Error' : 'Unknown host'});
                                }
                            });
                        } else {
                            callback(400, { 'Error' : 'Max number of checks reached' });
                        };
                    } else {
                        callback(403);
                    };
                });
            } else {
                callback(403);
            };
        });
    } else {
        callback(400,{ 'Error' : 'Missing required field' });
    };
};



handlers._checks.get = function(data,callback) {
    const id = typeof(data.queryStringObject.id) == "string" && data.queryStringObject.id.trim().length >= 19 ? data.queryStringObject.id.trim() : false;
    if(id) {

        _data.read('checks',id,function(err,checkData) {
            if(!err && checkData) {

                const token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
                handlers._tokens.verifyToken(token,checkData.userPhone,function(tokenIsValid) {
                    if(tokenIsValid) {
                    callback(200,checkData);
                    } else {
                        callback(403)
                    };
                });
            } else {
                callback(404);
            };
        });
        
    } else {
        callback(400,{ 'Error' : 'Missing required field' });
    };
};


handlers._checks.put = function(data,callback) {
    const id = typeof(data.payload.id) == "string" && data.payload.id.trim().length >= 19 ? data.payload.id.trim() : false;

    const protocol = typeof(data.payload.protocol) == 'string' && ['https','http'].indexOf(data.payload.protocol) > -1 ? data.payload.protocol : false;
    const url = typeof(data.payload.url) == 'string' && data.payload.url.trim().length > 0 ? data.payload.url.trim() : false;
    const method = typeof(data.payload.method) == 'string' && ['post','get','put','delete'].indexOf(data.payload.method) > -1 ? data.payload.method : false;
    const successCodes = typeof(data.payload.successCodes) == 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0 ? data.payload.successCodes : false;
    const timeoutSeconds = typeof(data.payload.timeoutSeconds) == 'number' && data.payload.timeoutSeconds % 1 === 0 &&  data.payload.timeoutSeconds >= 1 && data.payload.timeoutSeconds <= 5 ? data.payload.timeoutSeconds : false;

    if(id) {
        if(protocol || url || method || successCodes || timeoutSeconds) {
            _data.read('checks',id,function(err,checkData) {
               if(!err && checkData) {
                    const token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
                    handlers._tokens.verifyToken(token,checkData.userPhone,function(tokenIsValid) {
                        console.log(tokenIsValid)
                        if(tokenIsValid) {
                            if(protocol) {
                                checkData.protocol = protocol;
                            };
                            if(url) {
                                checkData.url = url;
                            };
                            if(method) {
                                checkData.method = method;
                            };
                            if(successCodes) {
                                checkData.successCodes = successCodes;
                            };
                            if(timeoutSeconds) {
                                checkData.timeoutSeconds = timeoutSeconds;
                            };

                            _data.update('checks',id,checkData,function(err) {
                                if(!err) {
                                    callback(200);
                                } else {
                                    callback(500,{ 'Error' : 'Could not update the check' });
                                };
                            })
                        } else {
                            callback(403)
                        };
                    });
               } else {
                    callback(400,{ 'Error' : 'checkID did not exists' });
               };
            });
        } else {
            callback(400,{ 'Error' : 'Missing fields to update' });
        };
    } else {
        callback(400,{ 'Error' : 'Missing required field' });
    };
};



handlers._checks.delete = function(data,callback) {
    const id = typeof(data.queryStringObject.id) == "string" && data.queryStringObject.id.trim().length >= 19 ? data.queryStringObject.id.trim() : false;
    if(id) {

        _data.read('checks',id,function(err,checkData) {
            if(!err && checkData) {
                const token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
                handlers._tokens.verifyToken(token,checkData.userPhone,function(tokenIsValid) {
                    if(tokenIsValid) {

                        _data.delete('checks',id,function(err) {
                            if(!err) {
                                _data.read('users',checkData.userPhone,function(err,userData) {
                                    if(!err && userData) {
                                        let userChecks = typeof(userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : [];

                                        let checkPosition = userChecks.indexOf(id);
                                        if(checkPosition > -1) {
                                            userChecks.splice(checkPosition,1);

                                            _data.update('users',checkData.userPhone,userData,function(err) {
                                                if(!err) {
                                                    callback(200);
                                                } else {
                                                    callback(500,{ 'Error' : 'Could not update specified user' });
                                                }
                                            });
                                        } else {
                                            callback(500,{ 'Error' : 'COuld not find the check on the users object' });
                                        };
                                    } else {
                                        callback(500,{ 'Error' : 'Could not find the user who created the check' });
                                    };
                                });
                            } else {
                                callback(500, { 'Error' : 'Could not delete check' });
                            }
                        })

                    } else {
                        callback(403, { 'Error' : 'Missing required token' });
                    };
                });  
            } else {
                callback(400,{ 'Error' : 'The specified checkID does not exist' });
            };
        })

          
    } else {
        callback(400,{ 'Error' : 'Missing required field' });
    };
};

handlers.exampleError = function(data,callback) {
    let err = new Error('Example error');
    throw(err);
};


handlers.ping = function(data, callback) {
    callback(200);
};

handlers.notFound = function(data, callback) {
    callback(404);
};

module.exports = handlers;