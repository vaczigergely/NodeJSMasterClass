const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

let lib = {}
lib.baseDir = path.join(__dirname,'/../.logs/');

lib.append = function(file,str,callback) {
    fs.open(lib.baseDir+file+'.log','a',function(err,fileDescriptor) {
        if(!err && fileDescriptor) {
            fs.appendFile(fileDescriptor,str+'\n',function(err) {
                if(!err) {
                    fs.close(fileDescriptor,function(err) {
                        if(!err) {
                            callback(false);
                        } else {
                            callback('Error cloding file');
                        };
                    });
                } else {    
                    callback('Error appending the file');
                };
            });
        } else {
            callback('Could not open file for appending');
        }
    });  
};

lib.list = function(includeCompressedLogs,callback) {
    fs.readdir(lib.baseDir,function(err,data) {
        if(!err && data && data.length > 0) {
            let trimmedFileNames = [];
            data.forEach(function(fileName) {
                if(fileName.indexOf('.log') > -1) {
                    trimmedFileNames.push(fileName.replace('.log',''));
                }

                if(fileName.indexOf('.gz.b64') > -1 && includeCompressedLogs) {
                    trimmedFileNames.push(fileName.replace('.gz.b64',''));
                }
            });
            callback(false,trimmedFileNames);
        } else {
            callback(err,data);
        };
    });
};


lib.compress = function(logId,newFileId,callback) {
    let sourceFile = logId+'.log';
    let destFile = newFileId+'.gz.b64';
    
    fs.readFile(lib.baseDir+sourceFile,'utf8',function(err,inputString) {
        if(!err && inputString) {
            zlib.gzip(inputString,function(err,buffer) {
                if(!err && buffer) {
                    fs.open(lib.baseDir+destFile,'wx',function(err,fileDescriptor) {
                        if(!err && fileDescriptor) {
                            fs.writeFile(fileDescriptor,buffer.toString('base64'),function(err) {
                                if(!err) {
                                    fs.close(fileDescriptor, function(err) {
                                        if(!err) {
                                            callback(false);
                                        } else {
                                            callback(err);
                                        };
                                    });
                                } else {
                                    callback(err);
                                };
                            });
                        } else {
                            callback(err);
                        };
                    });
                } else {    
                    callback(err);
                };
            });
        } else {
            callback(err);
        }; 
    });
};


lib.decompress = function(fileId,callback) {
    let fileName = fileId+'.gz.b64';
    fs.readFile(lib.baseDir+fileName,'utf8',function(err,str) {
        if(!err && str) {
            let inputBuffer = Buffer.from(str,'base64');
            zlib.unzip(inputBuffer,function(err,outputBuffer) {
                if(!err && outputBuffer) {
                    let str = outputBuffer.toString();
                    callback(false,str);
                } else {
                    callback(err);
                }
            });
        } else {
            callback(err);
        };
    });
};


lib.truncate = function(logId,callback) {
    fs.truncate(lib.baseDir+logId+'.log',0,function(err) {
        if(!err) {
            callback(false);
        } else {
            callback(err);
        };
    });
};


module.exports = lib;