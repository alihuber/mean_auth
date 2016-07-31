process.env.NODE_ENV = 'test';
process.env.PORT     = '3001';

var app          = require('../../app');
var mongoose     = require('mongoose');
var should       = require('chai').should();
require('../../backend/models/user');
var User         = mongoose.model('User');
var supertest    = require("supertest");
var server       = supertest.agent("http://localhost:3001");
var jwt          = require('jsonwebtoken');
mongoose.Promise = global.Promise;

describe('Profile endpoint', function () {
  after(function(done) {
    console.log('resetting test database...');
    mongoose.connect('mongodb://127.0.0.1:28017/mean_auth', function() {
        User.collection.remove();
    });
    done();
  });

  describe('requesting /api/profile with no auth header', function() {
    it('should return 401', function(done) {
      server
        .get('/api/profile')
        .expect("Content-type",/json/)
        .expect(401)
        .end(function(err, res) {
          res.status.should.equal(401);
          res.text.should.include('UnauthorizedError');
          done();
      });
    });
  });

  describe('requesting /api/profile with wrong auth header', function() {
    it('should return 401', function(done) {
      // no _id property
      server
        .get('/api/profile')
        .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
             'eyJ1c2VybmFtZSI6InJlZ2lzdGVyZWQiLCJleHAiOjE0NzA1NjgyMTEsImlhdCI' +
             '6MTQ2OTk2MzQxMX0.UiSO2PefzfEVIrqBCJzIxBfXjJvc7_pAD2n96gajs5A')
        .expect("Content-type",/json/)
        .expect(401)
        .end(function(err, res) {
          res.status.should.equal(401);
          res.text.should.include('UnauthorizedError: private profile');
          done();
      });
    });
  });

  describe('requesting /api/profile with existing user', function() {
    before(function(done) {
      console.log('populating test database...');
      var user      = new User();
      user.username = 'registered';
      user.setPassword('registered');
      user.save();
      done();
    });

    it('should return 200 with user data', function(done) {
      var token = "";
      var userId = "";
      User.find({username: 'registered'}).then(function(users, err) {
        userId = users[0]._id;
        var expiry = new Date();
        expiry.setDate(expiry.getDate() + 7);
        token = jwt.sign({
          _id: users[0]._id,
          username: 'registered',
          exp: parseInt(expiry.getTime() / 1000),
        }, "MY_SECRET");
        server
          .get('/api/profile')
          .set('Authorization', 'Bearer ' + token)
          .expect("Content-type",/json/)
          .expect(200)
          .end(function(err, res) {
            res.status.should.equal(200);
            res.text.should.include('"username":"registered"');
            done();
          });
        });
      });
    });
});
