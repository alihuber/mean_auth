process.env.NODE_ENV = 'test';
process.env.PORT     = '3001';

var app       = require('../../app');
var mongoose  = require('mongoose');
var should    = require('chai').should();
require('../../backend/models/user');
var User      = mongoose.model('User');
var supertest = require("supertest");
var server    = supertest.agent("http://localhost:3001");

describe('Register endpoint', function () {
  after(function(done) {
    console.log('resetting test database...');
    mongoose.connect('mongodb://127.0.0.1:28017/mean_auth', function() {
        User.collection.remove();
    });
    done();
  });

  describe('requesting /api/register with no username', function() {
    it('should return 400', function(done) {
      server
        .post('/api/register')
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

  describe('requesting /api/register with no password', function() {
    it('should return 400', function(done) {
      server
        .post('/api/register')
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

  describe('requesting /api/register with existing username', function() {
    before(function(done) {
      console.log('populating test database...');
      var user      = new User();
      user.username = 'registered';
      user.setPassword('registered');
      user.save();
      done();
    });

    it('should return 401 with error message', function(done) {
      server
        .post('/api/register')
        .send( {'username': 'registered', 'password': 'registered'} )
        .expect("Content-type",/json/)
        .expect(401)
        .end(function(err, res) {
          res.status.should.equal(401);
          res.text.should.include('different');
          done();
      });
    });
  });

  describe('requesting /api/register new user', function() {
    it('should return 200 with token', function(done) {
      server
        .post('/api/register')
        .send( {'username': 'new_user', 'password': 'new_password'} )
        .expect("Content-type",/json/)
        .expect(200)
        .end(function(err, res) {
          res.status.should.equal(200);
          res.text.should.include('token');
          mongoose.Promise = global.Promise;
          var promise = User.find({ username: 'new_user' }).exec();
          promise.then(function(users) {
            users.size().should.equal(1);
          });
          done();
      });
    });
  });
});
