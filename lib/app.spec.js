'use strict';

var assert = require('chai').assert;

var App = require('./app');

var app = new App();

describe('App Bootstrap', function () {
	it('Should exist', function () {
		assert.isNotNull(app);
	});
});
describe('App', function () {
	it('Should stop services', function (done) {
		app.stop(60 * 1000, function () {
			return done();
		});
	});
});
describe('App status', function () {
	it('Should return service status should return array', function () {
		var statuses = app.status();
		assert.isArray(statuses);
	});
});