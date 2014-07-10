'use strict';

process.env.DBNAME = 'nodeTemplate-test';
var app = require('../../app/app');
var request = require('supertest');
var expect = require('chai').expect;
var fs = require('fs');
var exec = require('child_process').exec;
var Site;
var User;
var u1;
var cookie;

describe('site', function(){
  this.timeout(10000);
  before(function(done){
    request(app)
    .get('/')
    .end(function(err, res){
      Site = require('../../app/models/site');
      User = require('../../app/models/user');
      done();
    });
  });
  beforeEach(function(done){
    var testdir = __dirname + '/../../app/static/img/sites';
    var cmd = 'rm -rf ' + testdir;
    exec(cmd, function(){
      var origfile = __dirname + '/../fixtures/test.jpg';
      var copyfile = __dirname + '/../fixtures/test-copy.jpg';
      fs.createReadStream(origfile).pipe(fs.createWriteStream(copyfile));
      global.nss.db.dropDatabase(function(err, result){
        u1 = new User({email:'siteacceptance@nomail.com', name:'site Accept guy', password:'1234'});
        u1.register(function(err, inserted){
          request(app)
          .post('/login')
          .field('email', 'siteacceptance@nomail.com')
          .field('password', '1234')
          .end(function(err, res){
            cookie = res.headers['set-cookie'];
            var site = {
              title: 'title'
            };
            var imageFile = __dirname + '/../fixtures/test-copy.jpg';
            request(app)
            .post('/site/create')
            .set('cookie', cookie)
            .send({site:site, imageFile:imageFile})
            .end(function(err, res){
              done();
            });
          });
        });
      });
    });
  });
  describe('create site', function(){
    it('should create a new Site object, add to DB', function(done){
      var site = {
        title: 'title',
        description: 'description of the site.',
        url: 'http://druflix.andrewwilliammoore.com',
        github: 'https://github.com/drewmoore/druflix',
        framework: 'Node',
        host: 'Amazon EC2, Ubuntu Server',
        priority: 1
      };
      var imageFile = __dirname + '/../fixtures/test-copy.jpg';
      request(app)
      .post('/sites/create')
      .set('cookie', cookie)
      .send({site:site, imageFile:imageFile})
      .end(function(err, res){
        expect(res.status).to.equal(302);
        done();
      });
    });
  });
  describe('update site', function(){
    it('should update a Site in DB', function(done){
      var site = {
        title: 'title',
        description: 'description of the site.',
        url: 'http://druflix.andrewwilliammoore.com',
        github: 'https://github.com/drewmoore/druflix',
        framework: 'Node',
        host: 'Amazon EC2, Ubuntu Server',
        priority: 1
      };
      var imageFile = __dirname + '/../fixtures/test-copy.jpg';
      request(app)
      .post('/sites/create')
      .set('cookie', cookie)
      .send({site:site, imageFile:imageFile})
      .end(function(err, res){
        site.title = 'title edited';
        site.description = 'description edited';
        site.url = 'http://nytimes.com';
        site.github = 'http://theonion.com';
        var sitePathSplit = res.header.location.split('/');
        var siteId = sitePathSplit[sitePathSplit.length - 1];
        request(app)
        .post('/sites/update/' + siteId)
        .set('cookie', cookie)
        .send({site:site, imageFile:imageFile})
        .end(function(err, res){
          request(app)
          .get('/sites/' + siteId)
          .set('cookie', cookie)
          .end(function(err, res){
            expect(res.text).to.include(site.title);
            done();
          });
        });
      });
    });
  });
  describe('delete site', function(){
    it('should remove a site from the DB', function(done){
      var site = {title: 'title'};
      var imageFile = __dirname + '/../fixtures/test-copy.jpg';
      request(app)
      .post('/sites/create')
      .set('cookie', cookie)
      .send({site:site, imageFile:imageFile})
      .end(function(err, res){
        var sitePathSplit = res.header.location.split('/');
        var siteId = sitePathSplit[sitePathSplit.length - 1];
        request(app)
        .post('/sites/delete/' + siteId)
        .end(function(err, res){
          expect(res.status).to.equal(302);
          request(app)
          .get('/sites' + siteId)
          .end(function(err, res){
            expect(res.status).to.equal(404);
            done();
          });
        });
      });
    });
  });

});
