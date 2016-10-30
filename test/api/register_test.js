process.env.NODE_ENV = 'test';
process.env.PORT     = '3001';

const app       = require('../../app');
const mongoose  = require('mongoose');
const should    = require('chai').should();
require('../../backend/models/user');
const User      = mongoose.model('User');
const supertest = require('supertest');
const server    = supertest.agent('http://localhost:3001');

describe('Register endpoint', () => {
  after((done) => {
    console.log('resetting test database...');
    mongoose.connect('mongodb://127.0.0.1:28017/mean_auth', () => {
        User.collection.remove();
    });
    done();
  });

  describe('requesting /api/register with no username', () => {
    it('should return 400', (done) => {
      server
        .post('/api/register')
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

  describe('requesting /api/register with no password', () => {
    it('should return 400', (done) => {
      server
        .post('/api/register')
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

  describe('requesting /api/register with existing username', () => {
    before((done) => {
      console.log('populating test database...');
      let user      = new User();
      user.username = 'registered';
      user.setPassword('registered');
      user.save();
      done();
    });

    it('should return 401 with error message', (done) => {
      server
        .post('/api/register')
        .send( {'username': 'registered', 'password': 'registered'} )
        .expect('Content-type',/json/)
        .expect(401)
        .end((err, res) => {
          res.status.should.equal(401);
          res.text.should.include('different');
          done();
      });
    });
  });

  describe('requesting /api/register new user', () => {
    it('should return 200 with token', (done) => {
      server
        .post('/api/register')
        .send( {'username': 'new_user', 'password': 'new_password'} )
        .expect('Content-type',/json/)
        .expect(200)
        .end((err, res) => {
          res.status.should.equal(200);
          res.text.should.include('token');
          let promise = User.find({ username: 'new_user' }).exec();
          promise.then((users) => {
            users.length.should.equal(1);
          });
          done();
      });
    });
  });
});
