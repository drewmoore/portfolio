'use strict';

var app = require('../../app/app');
var request = require('supertest');
var expect = require('chai').expect;
var User;
var u1;
var Site;

describe('users', function(){

  before(function(done){
    this.timeout(10000);
    request(app)
    .get('/')
    .end(function(err, res){
      User = require('../../app/models/user');
      Site = require('../../app/models/site');
      done();
    });
  });
  beforeEach(function(done){
    global.nss.db.dropDatabase(function(err, result){
      u1 = new User({name:'Andrew before each accept', email:'drewbeforeeach@nomail.com', password:'1234'});
      u1.register(function(err, body){
        var s1 = new Site({title:'title before each'});
        s1.addUser(u1._id);
        s1.insert(function(err, records){
          u1.addSite(s1._id);
          u1.update(function(err, record){
            done();
          });
        });
      });
    });
  });
  describe('GET /', function(){
    it('should display the home page', function(done){
      request(app)
      .get('/')
      .expect(200, done);
    });
  });
  describe('GET /auth', function(){
    it('should display the login/register page', function(done){
      request(app)
      .get('/auth')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        done();
      });
    });
  });
  describe('POST /register', function(){
    it('should register a new user', function(done){
      request(app)
      .post('/register')
      .field('name', 'Andrew accept')
      .field('email', 'drewAcceptance@nomail.com')
      .field('password', '1234')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        done();
      });
    });
    it('should not register a duplicate user', function(done){
      request(app)
      .post('/register')
      .field('name', 'Andrew before each accept')
      .field('email', 'drewbeforeeach@nomail.com')
      .field('password', '1234')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        done();
      });
    });
  });
  describe('POST /login', function(){
    it('should login a user', function(done){
      request(app)
      .post('/login')
      .field('email', 'drewbeforeeach@nomail.com')
      .field('password', '1234')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.headers['set-cookie']).to.have.length(1);
        done();
      });
    });
    it('should not login a user', function(done){
      request(app)
      .post('/login')
      .field('email', 'drewbeforeeach@nomail.com')
      .field('password', 'abcd')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        done();
      });
    });
  });
  describe('POST /logout', function(){
    it('should logout a user', function(done){
      request(app)
      .post('/logout')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        done();
      });
    });
  });
});
