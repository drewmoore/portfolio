'use strict';

var Site;
var sites = global.nss.db.collection('sites');
var Mongo = require('mongodb');
var path = require('path');
var fs = require('fs');

module.exports = Site;

function Site(site){
  this.title = site.title;
  this.userId = '';
}

Site.index = function(fn){
  sites.find().toArray(function(err, records){
    fn(records);
  });
};

Site.prototype.addUser = function(userId){
  var self = this;
  self.userId = userId.toString();
};

Site.prototype.insert = function(fn){
  var self = this;
  sites.find({_id:self._id}).toArray(function(err, foundEntries){
    if(foundEntries.length === 0){
      sites.insert(self, function(err, records){
        fn(err, records);
      });
    } else {
      fn('That site is already in here, yo!');
    }
  });
};
Site.prototype.addImage = function(oldname, fn){
  var self = this;
  var extension = path.extname(oldname);
  var siteId = this._id.toString();
  var absolutePath = __dirname + '/../static';
  var sitesPath = absolutePath + '/img/sites';
  var relativePath = '/img/sites/' + siteId + extension;
  fs.mkdir(sitesPath, function(){
    fs.rename(oldname, absolutePath + relativePath, function(err){
      self.image = relativePath;
      fn(err);
    });
  });
};
Site.findById = function(id, fn){
  var mongoId = new Mongo.ObjectID(id);
  sites.findOne({_id:mongoId}, function(err, record){
    fn(record);
  });
};

Site.findByUserId = function(id, fn){
  sites.find({userId:id.toString()}).toArray(function(err, records){
    fn(records);
  });
};

Site.prototype.update = function(fn){
  var self = this;
  sites.update({_id:self._id}, self, function(err, count){
    Site.findById(self._id.toString(), function(record){
      fn(record);
    });
  });
};

Site.destroy = function(id, fn){
  if((typeof id) === 'string'){
    id = Mongo.ObjectID(id);
  }
  sites.remove({_id:id}, function(err, count){
    fn(err, count);
  });
};
