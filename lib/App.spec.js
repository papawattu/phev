'use strict';

const assert = require('chai').assert

const App = require('./App')

const app = new App();

describe('App Bootstrap', () => {
  it('Should exist',  () => {
    assert.isNotNull(app);
  })
});
describe('App', () => {
  it('Should stop services', (done) => {
    app.stop(60 * 1000,(err) => {
        return done();
    });
  });
});
describe('App status', () => {
  it('Should return service status should return array', () => {
    const statuses = app.status();
    assert.isArray(statuses);
  });
});