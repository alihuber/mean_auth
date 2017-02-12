process.env.NODE_ENV = 'test';
process.env.PORT     = '3001';

const app        = require('../../app');
const mongoose   = require('mongoose');
mongoose.Promise = global.Promise;
const should     = require('chai').should();
require('../../backend/models/user');
const User       = mongoose.model('User');
const supertest  = require('supertest');
const server     = supertest.agent('http://localhost:3001');
const jwt        = require('jsonwebtoken');

describe('All users endpoint', () => {
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

  describe('requesting GET /api/users with no auth header', () => {
    it('should return 401', (done) => {
      server
        .get('/api/users')
        .expect('Content-type',/json/)
        .expect(401)
        .end((err, res) => {
          res.status.should.equal(401);
          res.text.should.include('UnauthorizedError');
          done();
      });
    });
  });

  describe('requesting GET /api/users with no id in header', () => {
    it('should return 401', (done) => {
      let token  = '';
      User.find({username: 'registered'}).then((users, err) => {
        let expiry = new Date();
        expiry.setDate(expiry.getDate() + 7);
        token      = jwt.sign({
          username: 'registered',
          exp: parseInt(expiry.getTime() / 1000),
        }, 'MY_SECRET');
        server
          .get('/api/users')
          .set('Authorization', 'Bearer ' + token)
          .expect('Content-type',/json/)
          .expect(401)
          .end((err, res) => {
            res.status.should.equal(401);
            res.text.should.include('UnauthorizedError');
            done();
        });
      });
    });
  });

  describe('requesting GET /api/users with not existent id in header', () => {
    it('should return 404', (done) => {
      let expiry = new Date();
      expiry.setDate(expiry.getDate() + 7);
      token      = jwt.sign({
        _id: '1234',
        username: 'registered',
        exp: parseInt(expiry.getTime() / 1000),
      }, 'MY_SECRET');
      server
        .get('/api/users')
        .set('Authorization', 'Bearer ' + token)
        .expect('Content-type',/json/)
        .expect(200)
        .end((err, res) => {
          res.status.should.equal(404);
          done();
      });
    });
  });

  describe('requesting GET /api/users with unauthorized user', () => {
    before((done) => {
      console.log('populating test database...');
      let user      = new User();
      user.username = 'registered';
      user.setPassword('registered');
      user.save();
      done();
    });

    it('should return 401', (done) => {
      let token  = '';
      let userId = '';
      User.find({username: 'registered'}).then((users, err) => {
        userId     = users[0]._id;
        let expiry = new Date();
        expiry.setDate(expiry.getDate() + 7);
        token      = jwt.sign({
          _id: users[0]._id,
          username: 'registered',
          exp: parseInt(expiry.getTime() / 1000),
        }, 'MY_SECRET');
        server
          .get('/api/users')
          .set('Authorization', 'Bearer ' + token)
          .expect('Content-type',/json/)
          .expect(401)
          .end((err, res) => {
            res.status.should.equal(401);
            res.text.should.include('UnauthorizedError');
            done();
        });
      });
    });
  });

  describe('requesting GET /api/users with valid data', () => {
    before((done) => {
      console.log('populating test database...');
      let user      = new User();
      user.username = 'admin';
      user.setPassword('admin');
      user.isAdmin  = true;
      user.save();
      done();
    });

    it('should return 200', (done) => {
      let token  = '';
      let userId = '';
      User.find({username: 'admin'}).then((users, err) => {
        userId     = users[0]._id;
        let expiry = new Date();
        expiry.setDate(expiry.getDate() + 7);
        token      = jwt.sign({
          _id: users[0]._id,
          username: 'admin',
          exp: parseInt(expiry.getTime() / 1000),
        }, 'MY_SECRET');
        server
          .get('/api/users')
          .set('Authorization', 'Bearer ' + token)
          .expect('Content-type',/json/)
          .expect(200)
          .end((err, res) => {
            res.status.should.equal(200);
            res.text.should.include('"username":"admin"');
            res.text.should.not.include('password');
            done();
        });
      });
    });
  });
});
