'use strict';

const assert = require('chai').assert

const App = require('./App')

const app = new App();

describe('Bootstrap', () => {
  it('App exists',  () => {
    assert.isNotNull(app);
  })
})