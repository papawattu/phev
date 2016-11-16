'use strict';

const assert = require('chai').assert;
const chai = require('chai');
const Store = require('./promise_store');
const chaiAsPromised = require('chai-as-promised');
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
		return assert.isFulfilled(store.set('key',test));
        //return p.becomes(store.get('key'),test);
	});
	it('should set value twice', () => {
		const test = Object.create(TestObj).init('Chris');
		store.set('key',test);
		return assert.becomes(store.get('key'),test);
	});
});
describe('Store get', () => {
	it('should get value', () => {
		const test = Object.create(TestObj).init('Chris');
		return assert.becomes(store.get('key'), test);
	});
	it('should get undefined back when key not found', () => {
		return assert.becomes(store.get('key2'), undefined);
	});
});
describe('Store has', () => {
	it('should has key', () => {
		return assert.becomes(store.has('key'),true);
	});
	it('should return false for key not found', () => {
		return assert.becomes(store.has('key3'),false);
	});
});
describe('Store del', () => {

	it('should delete value', () => {
		store.del('key');
		return assert.becomes(store.has('key'),false);
	});
});