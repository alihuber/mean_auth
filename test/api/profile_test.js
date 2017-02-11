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

describe('Profile endpoint', () => {
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

  describe('requesting /api/profile with no auth header', () => {
    it('should return 401', (done) => {
      server
        .get('/api/profile')
        .expect('Content-type',/json/)
        .expect(401)
        .end((err, res) => {
          res.status.should.equal(401);
          res.text.should.include('UnauthorizedError');
          done();
      });
    });
  });

  describe('requesting /api/profile with wrong auth header', () => {
    it('should return 401', (done) => {
      // no _id property
      server
        .get('/api/profile')
        .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
             'eyJ1c2VybmFtZSI6InJlZ2lzdGVyZWQiLCJleHAiOjE0NzA1NjgyMTEsImlhdCI' +
             '6MTQ2OTk2MzQxMX0.UiSO2PefzfEVIrqBCJzIxBfXjJvc7_pAD2n96gajs5A')
        .expect('Content-type',/json/)
        .expect(401)
        .end((err, res) => {
          res.status.should.equal(401);
          res.text.should.include('UnauthorizedError');
          done();
      });
    });
  });

  describe('requesting /api/profile with existing user', () => {
    before((done) => {
      console.log('populating test database...');
      let user      = new User();
      user.username = 'registered';
      user.setPassword('registered');
      user.save();
      done();
    });

    it('should return 200 with user data', (done) => {
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
          .get('/api/profile')
          .set('Authorization', 'Bearer ' + token)
          .expect('Content-type',/json/)
          .expect(200)
          .end((err, res) => {
            res.status.should.equal(200);
            res.text.should.include('"username":"registered"');
            done();
        });
      });
    });
  });

  describe('requesting /api/profile with not existing user', () => {
    it('should return 404', (done) => {
      let expiry = new Date();
      expiry.setDate(expiry.getDate() + 7);
      token      = jwt.sign({
        _id: "12345",
        username: 'registered',
        exp: parseInt(expiry.getTime() / 1000),
      }, 'MY_SECRET');
      server
        .get('/api/profile')
        .set('Authorization', 'Bearer ' + token)
        .expect('Content-type',/json/)
        .expect(200)
        .end((err, res) => {
          res.status.should.equal(404);
          done();
      });
    });
  });

  describe('requesting /api/profile with no id via PUT', () => {
    it('should return 404', (done) => {
      let expiry = new Date();
      expiry.setDate(expiry.getDate() + 7);
      token      = jwt.sign({
        username: 'registered',
        exp: parseInt(expiry.getTime() / 1000),
      }, 'MY_SECRET');
      server
        .put('/api/profile')
        .set('Authorization', 'Bearer ' + token)
        .expect('Content-type',/json/)
        .expect(200)
        .end((err, res) => {
          res.status.should.equal(401);
          res.text.should.include('UnauthorizedError');
          done();
      });
    });
  });

  describe('requesting /api/profile with no id via GET', () => {
    it('should return 404', (done) => {
      let expiry = new Date();
      expiry.setDate(expiry.getDate() + 7);
      token      = jwt.sign({
        username: 'registered',
        exp: parseInt(expiry.getTime() / 1000),
      }, 'MY_SECRET');
      server
        .get('/api/profile')
        .set('Authorization', 'Bearer ' + token)
        .expect('Content-type',/json/)
        .expect(200)
        .end((err, res) => {
          res.status.should.equal(401);
          res.text.should.include('UnauthorizedError');
          done();
      });
    });
  });

  describe('requesting /api/profile with updated user', () => {
    it('should return 200 with user data', (done) => {
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
          .put('/api/profile')
          .set('Authorization', 'Bearer ' + token)
          .send( {'username': 'new_name'} )
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

  describe('requesting /api/profile with invalid user', () => {
    before((done) => {
      console.log('populating test database...');
      let user1      = new User();
      user1.username = 'registered';
      user1.setPassword('registered');
      user1.save();
      let user2      = new User();
      user2.username = 'duplicate';
      user2.setPassword('duplicate');
      user2.save();
      done();
    });

    it('should return 200 with user data', (done) => {
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
          .put('/api/profile')
          .set('Authorization', 'Bearer ' + token)
          .send( {'username': 'duplicate'} )
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
