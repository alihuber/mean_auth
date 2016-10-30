process.env.NODE_ENV = 'test';
process.env.PORT     = '3001';

const app       = require('../../app');
const supertest = require('supertest');
const server    = supertest.agent('http://localhost:3001');

describe('express application itself', () => {
  describe('404 page', () => {
    it('should return 404 on unknown URLs', (done) => {
      server
        .get('/foo/bar')
        .expect('Content-type',/json/)
        .expect(404);
      done();
    });
  });
});
