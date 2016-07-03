"use strict";

var assert = require('assert');
var request = require('superagent');
var server = require('../app');
var status = require('http-status');
 
describe('/user', function() {
  var app;
 
  before(function() {
  //  app = server(3000);
  });
 
  after(function() {
  //  app.close();
  });
 
  it('returns username if name param is a valid user', function(done) {
    request.post('http://localhost:8080')
        .send({'cmd' : 'CONNECT','id' : 1234})
        .type('application/json')
        .accept('json')
        .end(function(err, res) {
      assert.ifError(err);
      assert.equal(res.status, status.OK);
      var result = JSON.parse(res.text);
      assert.notDeepEqual({ version: '0.1' }, result);
      done();
    });
  });
 /*
  it('returns 404 if user named `params.name` not found', function(done) {
    users.list = ['test'];
    superagent.get('http://localhost:3000/user/notfound').end(function(err, res) {
      assert.ifError(err);
      assert.equal(res.status, status.NOT_FOUND);
      var result = JSON.parse(res.text);
      assert.deepEqual({ error: 'Not Found' }, result);
      done();
    });
  }); */
});