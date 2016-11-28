'use strict';

const assert = require('chai').assert;
const chai = require('chai');
const Store = require('./store');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const store  = new Store();

const TestObj = {
	init: function(value) {
		this.value = value;
		return this;
	},
};

before(() => {

});
describe('Store set', () => {
	it('should set value', () => {
		const test = Object.create(TestObj).init('Jamie');
		store.set('key',test);
	});
	it('should set value twice', () => {
		const test = Object.create(TestObj).init('Chris');
		store.set('key',test);
	});
});
describe('Store get', () => {
	it('should get value', () => {
		const test = Object.create(TestObj).init('Chris');
		assert.deepEqual(store.get('key'), test);
	});
	it('should get null back when key not found', () => {
		assert.equal(store.get('key2'), null);
	});
});
describe('Store has', () => {
	it('should have key', () => {
		assert.equal(store.has('key'),true);
	});
	it('should return undefined for key not found', () => {
		assert.equal(store.has('key3'),false);
	});
});
describe('Store delete', () => {

	it('should delete value', () => {
		store.del('key');
		assert.equal(store.has('key'),false);
	});
	it('should be able to delete value twice', () => {
		store.del('key');
		assert.equal(store.has('key'),false);
	});
});