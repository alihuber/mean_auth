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

describe('Single user endpoint', () => {
  afterEach((done) => {
    console.log('resetting test database...');
    User.remove({}, function(err) {
      if(err) {
        console.log(err);
      }
      console.log('collection users removed');
    });
    done();
  });

  describe('requesting GET /api/user/:id with no auth header', () => {
    it('should return 401', (done) => {
      server
        .get('/api/user/123')
        .expect('Content-type',/json/)
        .expect(401)
        .end((err, res) => {
          res.status.should.equal(401);
          res.text.should.include('UnauthorizedError');
          done();
      });
    });
  });

  describe('requesting GET /api/user/id with no id in header', () => {
    it('should return 401', (done) => {
      let token        = '';
      let expiry       = new Date();
      expiry.setDate(expiry.getDate() + 7);
      token      = jwt.sign({
        username: 'admin',
        exp: parseInt(expiry.getTime() / 1000),
      }, 'MY_SECRET');
      server
        .get('/api/user/12345')
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

  describe('requesting GET /api/user/id with not existent id in header', () => {
    it('should return 404', (done) => {
      let token  = '';
      let expiry = new Date();
      expiry.setDate(expiry.getDate() + 7);
      token      = jwt.sign({
        username: 'admin',
        _id: '1234',
        exp: parseInt(expiry.getTime() / 1000),
      }, 'MY_SECRET');
      server
        .get('/api/user/some_id')
        .set('Authorization', 'Bearer ' + token)
        .expect('Content-type',/json/)
        .expect(404)
        .end((err, res) => {
          res.status.should.equal(404);
          done();
      });
    });
  });

  describe('requesting GET /api/user/:id with unauthorized user', () => {
    before((done) => {
      console.log('populating test database...');
      let user      = new User();
      user.username = 'registered';
      user.setPassword('registered');
      user.save();
      done();
    });

    it('should return 401', (done) => {
      let token    = '';
      let userId   = '';
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
          .get('/api/user/123')
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

  describe('requesting GET /api/user/:id with authorized user', () => {
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
      let token    = '';
      let userId   = '';
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
          .get('/api/user/123')
          .set('Authorization', 'Bearer ' + token)
          .expect('Content-type',/json/)
          .expect(200)
          .end((err, res) => {
            res.status.should.equal(200);
            res.text.should.include('{}');
            done();
        });
      });
    });
  });

  describe('requesting GET /api/user/:id with valid user data', () => {
    before((done) => {
      console.log('populating test database...');
      let user1      = new User();
      user1.username = 'admin';
      user1.setPassword('admin');
      user1.isAdmin  = true;
      user1.save();
      let user2      = new User();
      user2.username = 'some.user';
      user2.setPassword('some.password');
      user2.isAdmin  = false;
      user2.save();
      done();
    });

    it('should return 200 and user data', (done) => {
      let token       = '';
      let adminUserId = '';
      let userId      = '';
      User.find({username: 'some.user'}).then((users, err) => {
        userId = users[0]._id;
        User.find({username: 'admin'}).then((users, err) => {
          adminUserId = users[0]._id;
          let expiry  = new Date();
          expiry.setDate(expiry.getDate() + 7);
          token = jwt.sign({
            _id: users[0]._id,
            username: 'admin',
            exp: parseInt(expiry.getTime() / 1000),
          }, 'MY_SECRET');
          server
            .get('/api/user/' + userId)
            .set('Authorization', 'Bearer ' + token)
            .expect('Content-type',/json/)
            .expect(200)
            .end((err, res) => {
              res.status.should.equal(200);
              res.text.should.include('"username":"some.user"');
              res.text.should.include('"isAdmin":false');
              res.text.should.include('"_id":"' + userId + '"');
              res.text.should.not.include('password');
              done();
          });
        });
      });
    });
  });
});
