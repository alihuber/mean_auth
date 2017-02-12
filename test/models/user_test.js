process.env.NODE_ENV = 'test';
process.env.PORT     = '3001';

const mongoose   = require('mongoose');
mongoose.Promise = global.Promise;
const should     = require('chai').should();
require('../../backend/models/user');
const User       = mongoose.model('User');


describe('User model', () => {
  after((done) => {
    console.log('resetting test database...');
    User.remove({}, function(err) {
      if(err) {
        console.log(err);
      }
      console.log('collection users removed');
    });
    done();
  });

  describe('create with missing password', () => {
    it('should not create a new User', (done) => {
      let user = {
        username: 'Foo'
      };

      User.create(user, (err, createdUser) => {
        should.exist(err);
        err.message.should.equal('User validation failed');
        done();
      });
    });
  });

  describe('create with too short password', () => {
    it('should not create a new User', (done) => {
      let user = {
        username: 'Foo',
        password: 'baz'
      };

      User.create(user, (err, createdUser) => {
        should.exist(err);
        err.message.should.equal('User validation failed');
        done();
      });
    });
  });

  describe('create with missing username', () => {
    it('should not create a new User', (done) => {
      let user = {
        password: 'some.password'
      };

      User.create(user, (err, createdUser) => {
        should.exist(err);
        err.message.should.equal('User validation failed');
        done();
      });
    });
  });

  describe('create with too short username', () => {
    it('should not create a new User', (done) => {
      let user = {
        username: 's',
        password: 'some.password'
      };

      User.create(user, (err, createdUser) => {
        should.exist(err);
        err.message.should.equal('User validation failed');
        done();
      });
    });
  });

  describe('create with full data', () => {
    it('should create a new User', (done) => {
      let user = {
        username: 'Foo',
        password: 'some.password'
      };

      User.create(user, (err, createdUser) => {
        should.not.exist(err);
        createdUser.username.should.equal('Foo');
        createdUser.isAdmin.should.equal(false);
        done();
      });
    });
  });
});
