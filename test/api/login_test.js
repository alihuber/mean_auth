process.env.NODE_ENV = 'test';
process.env.PORT     = '3001';

const app       = require('../../app');
const mongoose  = require('mongoose');
const should    = require('chai').should();
require('../../backend/models/user');
const User      = mongoose.model('User');
const supertest = require('supertest');
const server    = supertest.agent('http://localhost:3001');

describe('Login endpoint', () => {
  afterEach((done) => {
    console.log('resetting test database...');
    mongoose.connect('mongodb://127.0.0.1:28017/mean_auth', () => {
        User.collection.remove();
    });
    done();
  });

  describe('requesting /api/login with no username', () => {
    it('should return 400', (done) => {
      server
        .post('/api/login')
        .send( {'password': 'some.password'} )
        .expect('Content-type',/json/)
        .expect(400)
        .end((err, res) => {
          res.status.should.equal(400);
          res.text.should.equal('{"message":"All fields required"}');
          done();
      });
    });
  });

  describe('requesting /api/login with no password', () => {
    it('should return 400', (done) => {
      server
        .post('/api/login')
        .send( {'username': 'some.user'} )
        .expect('Content-type',/json/)
        .expect(400)
        .end((err, res) => {
          res.status.should.equal(400);
          res.text.should.equal('{"message":"All fields required"}');
          done();
      });
    });
  });

  describe('requesting /api/login with unknown user', () => {
    it('should return 401', (done) => {
      server
        .post('/api/login')
        .send( {'username': 'some.user', 'password': 'some.password'} )
        .expect('Content-type',/json/)
        .expect(401)
        .end((err, res) => {
          res.status.should.equal(401);
          res.text
            .should.equal('{"message":"Invalid user/password combination."}');
          done();
      });
    });
  });

  describe('requesting /api/login with wrong password', () => {
    before((done) => {
      console.log('populating test database...');
      let user      = new User();
      user.username = 'registered';
      user.setPassword('registered');
      user.save();
      done();
    });

    it('should return 401', (done) => {
      server
        .post('/api/login')
        .send( {'username': 'registered', 'password': 'wrong.password'} )
        .expect('Content-type',/json/)
        .expect(401)
        .end((err, res) => {
          res.status.should.equal(401);
          res.text
            .should.equal('{"message":"Invalid user/password combination."}');
          done();
      });
    });
  });

  describe('requesting /api/login correct credentials user', () => {
    before((done) => {
      console.log('populating test database...');
      let user      = new User();
      user.username = 'registered';
      user.setPassword('registered');
      user.save();
      done();
    });

    it('should return 200 with token', (done) => {
      server
        .post('/api/login')
        .send( {'username': 'registered', 'password': 'registered'} )
        .expect('Content-type',/json/)
        .expect(200)
        .end((err, res) => {
          res.status.should.equal(200);
          res.text.should.include('token');
          done();
      });
    });
  });
});
