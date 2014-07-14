'use strict';

var d = require('../lib/request-debug');
var initialized = false;

module.exports = function(req, res, next){
  if(!initialized){
    initialized = true;
    load(req.app, next);
  }else{
    next();
  }
};

function load(app, fn){
  var home = require('../routes/home');
  var sites = require('../routes/sites');
  var users = require('../routes/users');
  var resumes = require('../routes/resumes');
  var contacts = require('../routes/contacts');

  app.get('/', d, home.index);
  app.get('/sites', d, sites.index);
  app.get('/sites/create', d, sites.createPage);
  app.get('/sites/:id', d, sites.show);
  app.get('/sites/edit/:id', d, sites.edit);
  app.get('/auth', d, users.auth);
  app.get('/resume', d, resumes.index);
  app.get('/contact', d, contacts.index);
  app.post('/sites/create', d, sites.create);
  app.post('/register', d, users.register);
  app.post('/login', d, users.login);
  app.post('/logout', d, users.logout);
  app.post('/sites/update/:id', d, sites.update);
  app.post('/sites/delete/:id', d, sites.remove);
  console.log('Routes Loaded');
  fn();
}
