process.env.NODE_ENV = 'test';
process.env.PORT     = '3001';

var app       = require('../../app');
var supertest = require("supertest");
var server    = supertest.agent("http://localhost:3001");

describe('express application itself', function () {
  describe('404 page', function() {
    it('should return 404 on unknown URLs', function(done) {
      server
        .get('/foo/bar')
        .expect("Content-type",/json/)
        .expect(404);
      done();
    });
  });
});