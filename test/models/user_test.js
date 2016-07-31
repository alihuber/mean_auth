var mongoose = require('mongoose');
var should   = require('chai').should();
require('../../backend/models/user');
var User     = mongoose.model('User');


describe('User model', function () {
  before(function() {
    console.log('connecting to test database');
    mongoose.connect('mongodb://127.0.0.1:28017/mean_auth');
  });

  after(function() {
    console.log('resetting test database...');
    mongoose.connect('mongodb://127.0.0.1:28017/mean_auth', function() {
        mongoose.connection.db.dropDatabase();
    });
  });

  describe('create with missing password', function () {
    it('should not create a new User', function (done) {
      var user = {
        username: 'Foo'
      };

      User.create(user, function (err, createdUser) {
        should.exist(err);
        err.message.should.equal('User validation failed');
        done();
      });
    });
  });

  describe('create with too short password', function () {
    it('should not create a new User', function (done) {
      var user = {
        username: 'Foo',
        password: 'baz'
      };

      User.create(user, function (err, createdUser) {
        should.exist(err);
        err.message.should.equal('User validation failed');
        done();
      });
    });
  });

  describe('create with missing username', function () {
    it('should not create a new User', function (done) {
      var user = {
        password: 'some.password'
      };

      User.create(user, function (err, createdUser) {
        should.exist(err);
        err.message.should.equal('User validation failed');
        done();
      });
    });
  });

  describe('create with too short username', function () {
    it('should not create a new User', function (done) {
      var user = {
        username: 's',
        password: 'some.password'
      };

      User.create(user, function (err, createdUser) {
        should.exist(err);
        err.message.should.equal('User validation failed');
        done();
      });
    });
  });

  describe('create with full data', function () {
    it('should create a new User', function (done) {
      var user = {
        username: 'Foo',
        password: 'some.password'
      };

      User.create(user, function (err, createdUser) {
        should.not.exist(err);
        createdUser.username.should.equal('Foo');
        done();
      });
    });
  });
});
