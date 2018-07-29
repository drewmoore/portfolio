'use strict';

var MongoClient = require('mongodb').MongoClient;
var dbName =  process.env.DBNAME;
var mongoUrl = 'mongodb://localhost/' + dbName;
var initialized = false;

exports.connect = function(req, res, next){
  if(!initialized){
    initialized = true;
    exports.db(next);
  }else{
    next();
  }
};

exports.db = function(fn){
  MongoClient.connect(mongoUrl, function(err, client) {
    if(err){throw err;}
    global.nss = {};
    global.nss.db = client.db(dbName);
    console.log('Connected to MongoDB');
    fn();
  });
};
