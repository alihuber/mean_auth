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

describe('Create user endpoint', () => {
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

  describe('requesting POST /api/user with no auth header', () => {
    it('should return 401', (done) => {
      server
        .post('/api/user')
        .expect('Content-type',/json/)
        .expect(401)
        .end((err, res) => {
          res.status.should.equal(401);
          res.text.should.include('UnauthorizedError');
          done();
      });
    });
  });

  describe('requesting POST /api/user with no id in header', () => {
    it('should return 401', (done) => {
      let token  = '';
      let expiry = new Date();
      expiry.setDate(expiry.getDate() + 7);
      token      = jwt.sign({
        username: 'admin',
        exp: parseInt(expiry.getTime() / 1000),
      }, 'MY_SECRET');
      server
        .post('/api/user')
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

  describe('requesting POST /api/user with not existent id in header', () => {
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
        .post('/api/user')
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

  describe('requesting POST /api/user with no data', () => {
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
        .post('/api/user')
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

  describe('requesting POST /api/user with unauthorized user', () => {
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
      User.find({username: 'registered'}).then((users, err) => {
        expiry.setDate(expiry.getDate() + 7);
        token      = jwt.sign({
          username: 'registered',
          _id: users[0]._id,
          exp: parseInt(expiry.getTime() / 1000),
        }, 'MY_SECRET');
        server
          .post('/api/user')
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

  describe('requesting POST /api/user with duplicate user data', () => {
    before((done) => {
      console.log('populating test database...');
      let user      = new User();
      user.username = 'admin';
      user.setPassword('admin');
      user.isAdmin  = true;
      user.save();
      done();
    });

    it('should return 500', (done) => {
      let token  = '';
      let expiry = new Date();
      User.find({username: 'admin'}).then((users, err) => {
        expiry.setDate(expiry.getDate() + 7);
        token      = jwt.sign({
          username: 'registered',
          _id: users[0]._id,
          exp: parseInt(expiry.getTime() / 1000),
        }, 'MY_SECRET');
        server
          .post('/api/user')
          .set('Authorization', 'Bearer ' + token)
          .send( {'username': 'registered', 'password': 'new_password'} )
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

  describe('requesting POST /api/user with valid user data', () => {
    it('should return 201 with success message', (done) => {
      let token  = '';
      let expiry = new Date();
      User.find({username: 'admin'}).then((users, err) => {
        expiry.setDate(expiry.getDate() + 7);
        token      = jwt.sign({
          username: 'registered',
          _id: users[0]._id,
          exp: parseInt(expiry.getTime() / 1000),
        }, 'MY_SECRET');
        server
          .post('/api/user')
          .set('Authorization', 'Bearer ' + token)
          .send( {'username': 'new_user', 'password': 'new_password'} )
          .expect('Content-type',/json/)
          .expect(201)
          .end((err, res) => {
            res.status.should.equal(201);
            res.text.should.include('"message":"success"');
            done();
        });
      });
    });
  });
});
