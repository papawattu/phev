'use strict';

const assert = require('chai').assert

const App = require('./App')

const app = new App();

describe('App Bootstrap', () => {
  it('Should exist',  () => {
    assert.isNotNull(app);
  })
})