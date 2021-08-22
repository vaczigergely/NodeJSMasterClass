const _data = require('./data');
const helpers = require('./helpers');

const handlers = {};

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

                    console.log(userObject)
    
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
        _data.read('users',phone,function(err,data) {
            if(!err && data) {
                delete data.password;
                callback(200,data);
            } else {
                callback(404);
            };
        })
    } else {
        callback(400,{ 'Error' : 'Missing required field' });
    };
};

handlers._users.put = function(data,callback) {
    
};

handlers._users.delete = function(data,callback) {
    
};


handlers.ping = function(data, callback) {
    callback(200);
};

handlers.notFound = function(data, callback) {
    callback(404);
};

module.exports = handlers;