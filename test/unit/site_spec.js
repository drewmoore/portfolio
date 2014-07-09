'use strict';

process.env.DBNAME = 'nodeTemplate-test';
var expect = require('chai').expect;
var fs = require('fs');
var exec = require('child_process').exec;
var Mongo = require('mongodb');
var Site;
var User;

describe('Site', function(){
  this.timeout(10000);
  before(function(done){
    var initMongo = require('../../app/lib/init-mongo');
    initMongo.db(function(){
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
        done();
      });
    });
  });
  describe('new', function(){
    it('should create a new Site object', function(done){
      var u1 = new User({email:'test@nomail.com', name:'sample', password:'1234'});
      u1.register(function(err, body){
        var s1 = new Site({title: 'Site Title', description: 'Description of the Site', url: 'http://druflix.andrewwilliammoore.com',
        github: 'https://github.com/drewmoore/druflix', framework: 'Node', host: 'Amazon EC2, Ubuntu'});
        s1.addUser(u1._id);
        expect(s1).to.be.instanceof(Site);
        expect(s1.title).to.equal('Site Title');
        expect(s1.description).to.equal('Description of the Site');
        expect(s1.url).to.equal('http://druflix.andrewwilliammoore.com');
        expect(s1.github).to.equal('https://github.com/drewmoore/druflix');
        expect(s1.framework).to.equal('Node');
        expect(s1.host).to.equal('Amazon EC2, Ubuntu');
        expect(s1.userId).to.equal(u1._id.toString());
        done();
      });
    });
  });
  describe('#insert', function(){
    it('should add a new Site record to the database', function(done){
      var u1 = new User({email:'test@nomail.com', name:'Test', password:'1234'});
      u1.register(function(err, body){
        var s1 = new Site({title: 'Site Title', description: 'Description of the Site', url: 'http://druflix.andrewwilliammoore.com',
        github: 'https://github.com/drewmoore/druflix', framework: 'Node', host: 'Amazon EC2, Ubuntu'});
        s1.addUser(u1._id);
        s1.insert(function(err, records){
          expect(s1._id).to.be.instanceof(Mongo.ObjectID);
          expect(records[0].title).to.equal(s1.title);
          expect(records[0].description).to.equal(s1.description);
          expect(records[0].url).to.equal(s1.url);
          expect(records[0].github).to.equal(s1.github);
          expect(records[0].framework).to.equal(s1.framework);
          expect(records[0].host).to.equal(s1.host);
          expect(records[0].userId).to.equal(u1._id.toString());
          done();
        });
      });
    });
  });
  describe('#addImage', function(){
    it('should add an image', function(done){
      var u1 = new User({email:'test@nomail.com', name:'Test', password:'1234'});
      u1.register(function(err, body){
        var s1 = new Site({title: 'stuff', userId:u1._id});
        s1.insert(function(err, records){
          var oldname = __dirname + '/../fixtures/test-copy.jpg';
          s1.addImage(oldname, function(){
            var siteId = s1._id.toString();
            expect(s1.image).to.equal('/img/sites/' + siteId + '.jpg');
            done();
          });
        });
      });
    });
  });
  describe('findById', function(){
    it('should find a Site by its Id', function(done){
      var s1 = new Site({title: 'stuff'});
      s1.insert(function(err, records){
        var id = (s1._id).toString();
        Site.findById(id, function(record){
          expect(record._id).to.deep.equal(s1._id);
          done();
        });
      });
    });
  });
  describe('findByUserId', function(){
    it('should find a Site by its userId', function(done){
      var u1 = new User({email:'test@nomail.com', name:'Test', password:'1234'});
      u1.register(function(err, body){
        var s1 = new Site({title: 'stuff'});
        s1.addUser(u1._id);
        s1.insert(function(err, records){
          Site.findByUserId(u1._id.toString(), function(results){
            expect(results.length).to.equal(1);
            expect(results[0].title).to.equal('stuff');
            done();
          });
        });
      });
    });
  });
  describe('index', function(){
    it('should find and return all sites', function(done){
      var s1 = new Site({title: 'stuff'});
      var s2 = new Site({title: 'other stuff'});
      s1.insert(function(err, records){
        s2.insert(function(err, records2){
          Site.index(function(records3){
            expect(records3.length).to.equal(2);
            done();
          });
        });
      });
    });
  });
  describe('#update', function(){
    it('should update a Site info in the database', function(done){
      var s1 = new Site({title: 'stuff'});
      s1.insert(function(err, records){
        s1.title = 'stuff changed';
        s1.update(function(result){
          var id = (s1._id).toString();
          Site.findById(id, function(record){
            expect(record.title).to.deep.equal(s1.title);
            done();
          });
        });
      });
    });
  });
  describe('destroy', function(){
    it('should delete a Site from the DB', function(done){
      var s1 = new Site({title: 'stuff'});
      s1.insert(function(err, records){
        Site.destroy(s1._id, function(err, count){
          Site.findById(records[0]._id.toString(), function(record){
            expect(record).to.deep.equal(null);
            done();
          });
        });
      });
    });
  });
});
