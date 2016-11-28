'use strict';

var assert = require('chai').assert;
var chai = require('chai');
var Store = require('./store');
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
		store.set('key', test);
	});
	it('should set value twice', function () {
		var test = Object.create(TestObj).init('Chris');
		store.set('key', test);
	});
});
describe('Store get', function () {
	it('should get value', function () {
		var test = Object.create(TestObj).init('Chris');
		assert.deepEqual(store.get('key'), test);
	});
	it('should get null back when key not found', function () {
		assert.equal(store.get('key2'), null);
	});
});
describe('Store has', function () {
	it('should have key', function () {
		assert.equal(store.has('key'), true);
	});
	it('should return undefined for key not found', function () {
		assert.equal(store.has('key3'), false);
	});
});
describe('Store delete', function () {

	it('should delete value', function () {
		store.del('key');
		assert.equal(store.has('key'), false);
	});
	it('should be able to delete value twice', function () {
		store.del('key');
		assert.equal(store.has('key'), false);
	});
});