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

describe('Update user endpoint', () => {
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

  describe('requesting PUT /api/user/:id with no auth header', () => {
    it('should return 401', (done) => {
      server
        .put('/api/user/12345')
        .expect('Content-type',/json/)
        .expect(401)
        .end((err, res) => {
          res.status.should.equal(401);
          res.text.should.include('UnauthorizedError');
          done();
      });
    });
  });

  describe('requesting PUT /api/user/:id with no id in header', () => {
    it('should return 401', (done) => {
      let token  = '';
      let expiry = new Date();
      expiry.setDate(expiry.getDate() + 7);
      token      = jwt.sign({
        username: 'admin',
        exp: parseInt(expiry.getTime() / 1000),
      }, 'MY_SECRET');
      server
        .put('/api/user/12345')
        .set('Authorization', 'Bearer ' + token)
        .send( {'username': 'new_user', 'password': 'new_password'} )
        .expect('Content-type',/json/)
        .expect(401)
        .end((err, res) => {
          res.status.should.equal(401);
          res.text.should.include('UnauthorizedError');
          done();
      });
    });
  });

  describe('requesting PUT /api/user/:id with not existent id in header', () => {
    it('should return 404', (done) => {
      let token  = '';
      let expiry = new Date();
      expiry.setDate(expiry.getDate() + 7);
      token      = jwt.sign({
        username: 'admin',
        _id: '12345',
        exp: parseInt(expiry.getTime() / 1000),
      }, 'MY_SECRET');
      server
        .put('/api/user/12345')
        .set('Authorization', 'Bearer ' + token)
        .send( {'username': 'new_user', 'password': 'new_password'} )
        .expect('Content-type',/json/)
        .expect(404)
        .end((err, res) => {
          res.status.should.equal(404);
          done();
      });
    });
  });

  describe('requesting PUT /api/user/:id with no data', () => {
    it('should return 400', (done) => {
      let token  = '';
      let expiry = new Date();
      expiry.setDate(expiry.getDate() + 7);
      token      = jwt.sign({
        username: 'admin',
        _id: '1234',
        exp: parseInt(expiry.getTime() / 1000),
      }, 'MY_SECRET');
      server
        .put('/api/user/12345')
        .set('Authorization', 'Bearer ' + token)
        .expect('Content-type',/json/)
        .expect(400)
        .end((err, res) => {
          res.status.should.equal(400);
          res.text.should.include('All fields required');
          done();
      });
    });
  });

  describe('requesting PUT /api/user/:id with unauthorized user', () => {
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
      let expiry = new Date();
      let userId = '';
      User.find({username: 'registered'}).then((users, err) => {
        userId = users[0]._id;
        expiry.setDate(expiry.getDate() + 7);
        token  = jwt.sign({
          username: 'registered',
          _id: userId,
          exp: parseInt(expiry.getTime() / 1000),
        }, 'MY_SECRET');
        server
          .put('/api/user/' + userId)
          .set('Authorization', 'Bearer ' + token)
          .send( {'username': 'new_user', 'password': 'new_password'} )
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

  describe('requesting PUT /api/user/:id with duplicate user data', () => {
    before((done) => {
      console.log('populating test database...');
      let user       = new User();
      user.username  = 'admin';
      user.setPassword('admin');
      user.isAdmin   = true;
      user.save();
      let user2      = new User();
      user2.username = 'duplicate';
      user2.setPassword('duplicate');
      user2.save();
      done();
    });

    it('should return 500', (done) => {
      let token  = '';
      let expiry = new Date();
      let userId = '';
      User.find({username: 'registered'}).then((users, err) => {
        userId = users[0]._id;
        User.find({username: 'admin'}).then((users, err) => {
          expiry.setDate(expiry.getDate() + 7);
          token      = jwt.sign({
            username: 'registered',
            _id: users[0]._id,
            exp: parseInt(expiry.getTime() / 1000),
          }, 'MY_SECRET');
          server
            .put('/api/user/' + userId)
            .set('Authorization', 'Bearer ' + token)
            .send( {'username': 'duplicate', 'password': 'new_password'} )
            .expect('Content-type',/json/)
            .expect(500)
            .end((err, res) => {
              res.status.should.equal(500);
              res.text.should.include('"message":' +
                  '"Please choose a different user name"');
              done();
          });
        });
      });
    });
  });

  describe('requesting PUT /api/user/:id with valid user data', () => {
    it('should return 200 with success message', (done) => {
      let token  = '';
      let expiry = new Date();
      let userId = '';
      User.find({username: 'registered'}).then((users, err) => {
        userId   = users[0]._id;
        User.find({username: 'admin'}).then((users, err) => {
          expiry.setDate(expiry.getDate() + 7);
          token  = jwt.sign({
            username: 'admin',
            _id: users[0]._id,
            exp: parseInt(expiry.getTime() / 1000),
          }, 'MY_SECRET');
          server
            .put('/api/user/' + userId)
            .set('Authorization', 'Bearer ' + token)
            .send( {'username': 'new_name', 'password': 'new_password'} )
            .expect('Content-type',/json/)
            .expect(200)
            .end((err, res) => {
              res.status.should.equal(200);
              res.text.should.include('"message":"success"');
              done();
          });
        });
      });
    });
  });
});
