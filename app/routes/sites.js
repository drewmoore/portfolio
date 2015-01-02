'use strict';

var User = require('../models/user');
var Site = require('../models/site');
var Mongo = require('mongodb');

exports.index = function(req, res){
  Site.index(function(sites){
    User.findById(req.session.userId, function(err, user){
      res.render('sites/index', {title: 'All Sites', sites:sites, user:user});
    });
  });
};

exports.createPage = function(req, res){
  if(req.session.userId){
    User.findById(req.session.userId, function(err, user){
      res.render('sites/create', {title:'Add a New Site', user:user});
    });
  } else {
    res.render('users/auth', {title:'Register/Login'});
  }
};

exports.create = function(req, res){
  var site =  {
    title: req.body.title || '',
    description: req.body.description || '',
    url: req.body.url || '',
    github: req.body.github || '',
    framework: req.body.framework || '',
    host: req.body.host || '',
    priority: req.body.priority || 5
  };
  var userIdString = req.session.userId.toString();
  var imageFile = req.body.imageFile || req.files.imageFile.path;
  User.findById(userIdString, function(userErr, user){
    if(typeof userErr === 'string'){
      res.render('sites/create', {title:'Add a New Site', err:userErr, user:user});
    } else {
      var s1 = new Site(site);
      s1.addUser(user._id);
      s1.insert(function(modelErr, records){
        if(typeof modelErr === 'string'){
          res.render('sites/create', {title:'Add a New Site', err:modelErr, user:user});
        } else {
          var u1 = new User(user);
          u1._id = user._id;
          u1.addSite(s1._id);
          s1.addImage(imageFile, function(err){
            u1.update(function(err, userRecord){
              s1.update(function(err, siteRecord){
                res.redirect('sites/' + s1._id.toString());
              });
            });
          });
        }
      });
    }
  });
};

exports.edit = function(req, res){
  Site.findById(req.params.id, function(site){
    User.findById(req.session.userId, function(err, user){
      res.render('sites/edit', {title:'Edit a Site', site:site, user:user});
    });
  });
};

exports.update = function(req, res){
  var s1 = new Site(req.body.site || req.body);
  //var imageFile = req.body.imageFile || req.files.imageFile.path;
  var imageFile = '';
  if(req.files.imageFile.size > 0){
    imageFile = req.body.imageFile || req.files.imageFile.path;
  }
  s1._id = new Mongo.ObjectID(req.params.id);
  s1.addImage(imageFile, function(err){
    s1.update(function(record){
      res.redirect('/sites/' + req.params.id);
    });
  });
};

exports.remove = function(req, res){
  Site.destroy(req.params.id, function(err, count){
    res.redirect('/sites');
  });
};

exports.show = function(req, res){
  User.findById(req.session.userId, function(err, user){
    Site.findById(req.params.id, function(site){
      if(site){
        res.render('sites/show', {title:'Site Show', site:site, user:user});
      } else {
        res.render('sites/', {title:'Sites', err:'site not found', user:user});
      }
    });
  });
};
