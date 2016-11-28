'use strict';

var assert = require('chai').assert;
var chai = require('chai');
var Store = require('./promise_store');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

var store = new Store();

var TestObj = {
	init: function init(value) {
		this.value = value;
		return this;
	}
};

before(function () {});
describe('Store set', function () {
	it('should set value', function () {
		var test = Object.create(TestObj).init('Jamie');
		return assert.isFulfilled(store.set('key', test));
		//return p.becomes(store.get('key'),test);
	});
	it('should set value twice', function () {
		var test = Object.create(TestObj).init('Chris');
		store.set('key', test);
		return assert.becomes(store.get('key'), test);
	});
});
describe('Store get', function () {
	it('should get value', function () {
		var test = Object.create(TestObj).init('Chris');
		return assert.becomes(store.get('key'), test);
	});
	it('should get undefined back when key not found', function () {
		return assert.becomes(store.get('key2'), undefined);
	});
});
describe('Store has', function () {
	it('should has key', function () {
		return assert.becomes(store.has('key'), true);
	});
	it('should return false for key not found', function () {
		return assert.becomes(store.has('key3'), false);
	});
});
describe('Store del', function () {

	it('should delete value', function () {
		store.del('key');
		return assert.becomes(store.has('key'), false);
	});
});