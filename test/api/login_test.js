process.env.NODE_ENV = 'test';
process.env.PORT     = '3001';

var app       = require('../../app');
var mongoose  = require('mongoose');
var should    = require('chai').should();
require('../../backend/models/user');
var User      = mongoose.model('User');
var supertest = require("supertest");
var server    = supertest.agent("http://localhost:3001");

describe('Login endpoint', function () {
  after(function(done) {
    console.log('resetting test database...');
    mongoose.connect('mongodb://127.0.0.1:28017/mean_auth', function() {
        User.collection.remove();
    });
    done();
  });

  describe('requesting /api/login with no username', function() {
    it('should return 400', function(done) {
      server
        .post('/api/login')
        .send( {'password': 'some.password'} )
        .expect("Content-type",/json/)
        .expect(400)
        .end(function(err, res) {
          res.status.should.equal(400);
          res.text.should.equal('{"message":"All fields required"}');
          done();
      });
    });
  });

  describe('requesting /api/login with no password', function() {
    it('should return 400', function(done) {
      server
        .post('/api/login')
        .send( {'username': 'some.user'} )
        .expect("Content-type",/json/)
        .expect(400)
        .end(function(err, res) {
          res.status.should.equal(400);
          res.text.should.equal('{"message":"All fields required"}');
          done();
      });
    });
  });

  describe('requesting /api/login with unknown user', function() {
    it('should return 400', function(done) {
      server
        .post('/api/login')
        .send( {'username': 'some.user', 'password': 'some.password'} )
        .expect("Content-type",/json/)
        .expect(401)
        .end(function(err, res) {
          res.status.should.equal(401);
          res.text
            .should.equal('{"message":"Invalid user/password combination."}');
          done();
      });
    });
  });

  describe('requesting /api/login with existing user', function() {
    before(function(done) {
      console.log('populating test database...');
      var user      = new User();
      user.username = 'registered';
      user.setPassword('registered');
      user.save();
      done();
    });

    it('should return 200 with token', function(done) {
      server
        .post('/api/login')
        .send( {'username': 'registered', 'password': 'registered'} )
        .expect("Content-type",/json/)
        .expect(200)
        .end(function(err, res) {
          res.status.should.equal(200);
          res.text.should.include('token');
          done();
      });
    });
  });
});
