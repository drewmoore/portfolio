'use strict';

var User = require('../models/user');
var Site = require('../models/site');
var _ = require('lodash');

exports.index = function(req, res){
  User.findById(req.session.userId, function(err, user){
    Site.index(function(records){
      var sites = _.sortBy(records, 'priority');
      res.render('home/index', {title: 'Drew Moore: a Portfolio', user:user, sites:sites});
    });
  });
};
